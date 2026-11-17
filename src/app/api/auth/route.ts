import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase/server";
import {
  assertAccountCanAuthenticate,
  DEFAULT_PRIVACY_SETTINGS,
  formatPhoneBR,
  normalizeCode,
  RegistrationInput,
  sanitizeUserForClient,
  validateRegistrationPayload,
} from "@/lib/veritas-engine/identity-rbac";
import {
  generateSecureToken,
  hashPassword,
  verifyPassword,
} from "@/lib/veritas-engine/password-crypto";
import { SEED_USERS } from "@/lib/veritas-engine/seed-data";
import {
  buildDeviceLabel,
  extractMaskedIp,
  recordActivityLog,
  resolveAuthenticatedUser,
  SESSION_COOKIE_NAME,
} from "@/lib/veritas-engine/server-auth";
import { VeritasUser } from "@/lib/veritas-engine/types";

export const dynamic = "force-dynamic";

const DEMO_SWITCH_IDS = new Set([
  "11111111-1111-4111-8111-111111111101",
  "11111111-1111-4111-8111-111111111102",
  "11111111-1111-4111-8111-111111111103",
  "11111111-1111-4111-8111-111111111104",
]);

function attachSessionCookie(response: NextResponse, token: string): NextResponse {
  response.cookies.set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
  return response;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const action = String(body.action ?? "").trim();
    const supabase = getSupabaseAdmin();

    if (action === "logout") {
      const ctx = await resolveAuthenticatedUser(request, supabase);
      if (supabase && ctx.token) {
        await supabase
          .from("veritas_sessions")
          .update({ is_active: false, last_seen_at: new Date().toISOString() })
          .eq("session_token", ctx.token);
        if (ctx.user) {
          await recordActivityLog(supabase, {
            userId: ctx.user.id,
            userName: ctx.user.full_name,
            userRole: ctx.user.role,
            actionType: "logout",
            description: "Sessao encerrada pelo usuario.",
          });
        }
      }
      const res = NextResponse.json({ loggedOut: true });
      res.cookies.delete(SESSION_COOKIE_NAME);
      return res;
    }

    if (!supabase) {
      return NextResponse.json(
        { error: "Servico de banco de dados indisponivel para autenticacao." },
        { status: 503 }
      );
    }

    if (action === "login") {
      const quickSwitchUserId = body.quickSwitchUserId
        ? String(body.quickSwitchUserId).trim()
        : "";

      let targetUser: VeritasUser | null = null;

      if (quickSwitchUserId) {
        if (!DEMO_SWITCH_IDS.has(quickSwitchUserId)) {
          return NextResponse.json(
            { error: "Troca rapida permitida apenas para contas de demonstracao." },
            { status: 403 }
          );
        }
        const { data } = await supabase
          .from("veritas_users")
          .select("*")
          .eq("id", quickSwitchUserId)
          .maybeSingle();
        targetUser = (data as VeritasUser) || null;
      } else {
        const identifier = String(body.identifier ?? "").trim().toLowerCase();
        const password = String(body.password ?? "");
        if (!identifier || !password) {
          return NextResponse.json(
            { error: "Informe e-mail ou nome de usuario e senha." },
            { status: 400 }
          );
        }

        const { data: usersList } = await supabase
          .from("veritas_users")
          .select("*");
        const found = ((usersList as VeritasUser[]) || SEED_USERS).find(
          (u) =>
            u.email.toLowerCase() === identifier ||
            u.username.toLowerCase() === identifier
        );

        if (!found || !verifyPassword(password, found.password_hash)) {
          return NextResponse.json(
            { error: "Credenciais invalidas. Confira usuario e senha." },
            { status: 401 }
          );
        }
        targetUser = found;
      }

      if (!targetUser) {
        return NextResponse.json({ error: "Usuario nao encontrado." }, { status: 404 });
      }

      const gate = assertAccountCanAuthenticate(targetUser);
      if (!gate.allowed) {
        return NextResponse.json(
          {
            error: gate.reason,
            requiresVerification: Boolean(gate.requiresVerification),
            email: targetUser.email,
          },
          { status: 403 }
        );
      }

      const sessionToken = generateSecureToken("sess", 16);
      const nowIso = new Date().toISOString();
      const { data: createdSession, error: sessErr } = await supabase
        .from("veritas_sessions")
        .insert({
          user_id: targetUser.id,
          session_token: sessionToken,
          device_label: buildDeviceLabel(request, body.deviceLabel),
          ip_masked: extractMaskedIp(request),
          is_active: true,
          created_at: nowIso,
          last_seen_at: nowIso,
        })
        .select()
        .single();

      if (sessErr) {
        return NextResponse.json(
          { error: `Falha ao abrir sessao: ${sessErr.message}` },
          { status: 500 }
        );
      }

      await recordActivityLog(supabase, {
        userId: targetUser.id,
        userName: targetUser.full_name,
        userRole: targetUser.role,
        actionType: "login",
        description: quickSwitchUserId
          ? `Acesso rapido ao perfil (${targetUser.role}).`
          : `Login autenticado em ${buildDeviceLabel(request, body.deviceLabel)}.`,
      });

      const res = NextResponse.json({
        user: sanitizeUserForClient(targetUser),
        session: {
          ...createdSession,
          session_token: "sessao-atual",
        },
        message: `Sessao iniciada como ${targetUser.full_name}.`,
      });
      return attachSessionCookie(res, sessionToken);
    }

    if (action === "register") {
      const payload = body as RegistrationInput;
      const { data: existingRows } = await supabase.from("veritas_users").select("*");
      const existingUsers = (existingRows as VeritasUser[]) || [];

      const validation = validateRegistrationPayload(payload, existingUsers);
      if (!validation.valid) {
        return NextResponse.json(
          {
            error: "Verifique os campos obrigatorios destacados no formulario.",
            errors: validation.errors,
          },
          { status: 400 }
        );
      }

      const nowIso = new Date().toISOString();
      const role = payload.role;
      const passwordHash = hashPassword(payload.password);
      const idCode =
        role === "aluno"
          ? payload.student_profile?.registration_code?.trim() ||
            `RA-${Math.floor(100000 + Math.random() * 899999)}`
          : role === "professor"
          ? payload.teacher_profile?.professional_registry?.trim() ||
            `DOC-${Math.floor(100 + Math.random() * 899)}`
          : `ADM-${Math.floor(100 + Math.random() * 899)}`;

      const { data: insertedUser, error: insertErr } = await supabase
        .from("veritas_users")
        .insert({
          role,
          account_status: "pendente_verificacao",
          email_verified: false,
          terms_accepted: Boolean(payload.terms_accepted),
          privacy_accepted: Boolean(payload.privacy_accepted),
          full_name: payload.full_name.trim(),
          social_name: (payload.social_name || "").trim(),
          avatar_url: (payload.avatar_url || "").trim(),
          birth_date: payload.birth_date,
          email: payload.email.trim().toLowerCase(),
          phone: formatPhoneBR(payload.phone),
          username: payload.username.trim().toLowerCase(),
          password_hash: passwordHash,
          country: payload.country.trim(),
          state: payload.state.trim(),
          city: payload.city.trim(),
          address: (payload.address || "").trim(),
          institution: payload.institution.trim(),
          bio: (payload.bio || "").trim(),
          identification_code: idCode,
          student_profile:
            role === "aluno"
              ? {
                  education_level: payload.student_profile?.education_level || "Ensino Superior",
                  grade_year: payload.student_profile?.grade_year || "1o Semestre",
                  cohort_label: payload.student_profile?.cohort_label || "TURMA-A",
                  shift: payload.student_profile?.shift || "Noturno",
                  course: payload.student_profile?.course || "",
                  subjects_of_interest: payload.student_profile?.subjects_of_interest || [],
                  learning_goals: payload.student_profile?.learning_goals || "",
                  academic_interests: payload.student_profile?.academic_interests || "",
                  registration_code: idCode,
                  advisor_teacher: payload.student_profile?.advisor_teacher || "",
                }
              : {},
          teacher_profile:
            role === "professor"
              ? {
                  academic_degree: payload.teacher_profile?.academic_degree || "",
                  specialization: payload.teacher_profile?.specialization || "",
                  subjects_taught: payload.teacher_profile?.subjects_taught || [],
                  professional_experience: payload.teacher_profile?.professional_experience || "",
                  professional_registry: payload.teacher_profile?.professional_registry || idCode,
                  linked_classes: payload.teacher_profile?.linked_classes || [],
                  institutional_validation_code:
                    payload.teacher_profile?.institutional_validation_code || "",
                  availability: payload.teacher_profile?.availability || "",
                }
              : {},
          admin_profile:
            role === "administrador"
              ? {
                  institutional_email: payload.admin_profile?.institutional_email || payload.email,
                  job_title: payload.admin_profile?.job_title || "",
                  department: payload.admin_profile?.department || "",
                  access_level: payload.admin_profile?.access_level || "gestor_academico",
                  admin_permissions: payload.admin_profile?.admin_permissions || [
                    "gerenciar_usuarios",
                    "gerenciar_turmas",
                    "exportar_relatorios",
                  ],
                }
              : {},
          privacy_settings: DEFAULT_PRIVACY_SETTINGS,
          security_settings: {
            two_factor_enabled: false,
            two_factor_method: "app_ou_email",
            recovery_token: "VER-2026",
            recovery_expires_at: new Date(Date.now() + 86400000).toISOString(),
            last_password_change: nowIso,
          },
          created_at: nowIso,
          updated_at: nowIso,
        })
        .select()
        .single();

      if (insertErr || !insertedUser) {
        return NextResponse.json(
          { error: insertErr?.message || "Erro ao registrar usuario." },
          { status: 500 }
        );
      }

      const newUser = insertedUser as VeritasUser;

      // Se o aluno informou codigo de turma no cadastro, abre solicitacao pendente
      if (role === "aluno" && payload.invite_class_code?.trim()) {
        const cleanCode = normalizeCode(payload.invite_class_code);
        const { data: matchedClass } = await supabase
          .from("veritas_classes")
          .select("id")
          .eq("code", cleanCode)
          .maybeSingle();

        if (matchedClass) {
          await supabase.from("veritas_class_enrollments").insert({
            class_id: matchedClass.id,
            student_id: newUser.id,
            student_name: newUser.full_name,
            student_ra: idCode,
            membership_status: "pendente",
            invite_code_used: cleanCode,
            message: "Solicitacao enviada durante o cadastro.",
          });
        }
      }

      await recordActivityLog(supabase, {
        userId: newUser.id,
        userName: newUser.full_name,
        userRole: newUser.role,
        actionType: "cadastro",
        description: `Nova conta ${newUser.role} criada (aguardando verificacao de e-mail).`,
      });

      return NextResponse.json({
        user: sanitizeUserForClient(newUser),
        verificationRequired: true,
        verificationCodeHint: "VER-2026",
        message: "Cadastro salvo. Confirme seu e-mail com o codigo VER-2026 para ativar a conta.",
      });
    }

    if (action === "verify_email") {
      const email = String(body.email ?? "").trim().toLowerCase();
      const code = String(body.code ?? "").trim().toUpperCase();
      if (!email || !code) {
        return NextResponse.json(
          { error: "Informe o e-mail e o codigo de verificacao." },
          { status: 400 }
        );
      }

      const { data: found } = await supabase
        .from("veritas_users")
        .select("*")
        .ilike("email", email)
        .maybeSingle();

      if (!found) {
        return NextResponse.json({ error: "Conta nao localizada." }, { status: 404 });
      }

      const u = found as VeritasUser;
      const expected = u.security_settings?.recovery_token || "VER-2026";
      if (code !== "VER-2026" && code !== expected) {
        return NextResponse.json(
          { error: "Codigo de verificacao incorreto (use VER-2026 para confirmar)." },
          { status: 400 }
        );
      }

      const nowIso = new Date().toISOString();
      const nextStatus = u.account_status === "pendente_verificacao" ? "ativa" : u.account_status;
      const { data: updatedUser } = await supabase
        .from("veritas_users")
        .update({
          email_verified: true,
          account_status: nextStatus,
          security_settings: { ...u.security_settings, recovery_token: "" },
          updated_at: nowIso,
        })
        .eq("id", u.id)
        .select()
        .single();

      const finalUser = (updatedUser as VeritasUser) || u;
      const sessionToken = generateSecureToken("sess", 16);
      await supabase.from("veritas_sessions").insert({
        user_id: finalUser.id,
        session_token: sessionToken,
        device_label: buildDeviceLabel(request),
        ip_masked: extractMaskedIp(request),
        is_active: true,
        created_at: nowIso,
        last_seen_at: nowIso,
      });

      await recordActivityLog(supabase, {
        userId: finalUser.id,
        userName: finalUser.full_name,
        userRole: finalUser.role,
        actionType: "verificacao_email",
        description: "E-mail verificado com sucesso; conta ativada.",
      });

      const res = NextResponse.json({
        user: sanitizeUserForClient(finalUser),
        verified: true,
        message: "E-mail confirmado e sessao iniciada.",
      });
      return attachSessionCookie(res, sessionToken);
    }

    if (action === "recover_password") {
      const step = String(body.step ?? "request").trim();
      const identifier = String(body.identifier ?? "").trim().toLowerCase();
      if (!identifier) {
        return NextResponse.json(
          { error: "Informe o e-mail ou nome de usuario da conta." },
          { status: 400 }
        );
      }

      const { data: usersList } = await supabase.from("veritas_users").select("*");
      const target = ((usersList as VeritasUser[]) || []).find(
        (u) =>
          (u.email.toLowerCase() === identifier ||
            u.username.toLowerCase() === identifier) &&
          u.account_status !== "excluida"
      );

      if (!target) {
        return NextResponse.json(
          { error: "Nenhuma conta ativa encontrada para esse identificador." },
          { status: 404 }
        );
      }

      if (step === "request") {
        await supabase
          .from("veritas_users")
          .update({
            security_settings: {
              ...target.security_settings,
              recovery_token: "REC-2026",
              recovery_expires_at: new Date(Date.now() + 3600000).toISOString(),
            },
          })
          .eq("id", target.id);

        return NextResponse.json({
          sent: true,
          recoveryCodeHint: "REC-2026",
          message: "Codigo de recuperacao gerado. Utilize REC-2026 para definir uma nova senha.",
        });
      }

      const code = String(body.code ?? "").trim().toUpperCase();
      const newPassword = String(body.newPassword ?? "");
      const confirmPassword = String(body.confirmPassword ?? "");

      const expectedCode = target.security_settings?.recovery_token || "REC-2026";
      if (code !== "REC-2026" && code !== expectedCode) {
        return NextResponse.json(
          { error: "Codigo de recuperacao invalido." },
          { status: 400 }
        );
      }
      if (newPassword.length < 6) {
        return NextResponse.json(
          { error: "A nova senha deve ter pelo menos 6 caracteres." },
          { status: 400 }
        );
      }
      if (newPassword !== confirmPassword) {
        return NextResponse.json(
          { error: "As senhas informadas nao coincidem." },
          { status: 400 }
        );
      }

      const nowIso = new Date().toISOString();
      await supabase
        .from("veritas_users")
        .update({
          password_hash: hashPassword(newPassword),
          security_settings: {
            ...target.security_settings,
            recovery_token: "",
            last_password_change: nowIso,
          },
          updated_at: nowIso,
        })
        .eq("id", target.id);

      await recordActivityLog(supabase, {
        userId: target.id,
        userName: target.full_name,
        userRole: target.role,
        actionType: "recuperacao_senha",
        description: "Senha redefinida por fluxo de recuperacao.",
      });

      return NextResponse.json({
        recovered: true,
        message: "Senha redefinida com sucesso. Voce ja pode entrar.",
      });
    }

    return NextResponse.json({ error: "Acao de autenticacao desconhecida." }, { status: 400 });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Erro interno de autenticacao." },
      { status: 500 }
    );
  }
}
