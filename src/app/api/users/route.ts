import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase/server";
import {
  buildLgpdExportPackage,
  canPerformAction,
  formatPhoneBR,
  sanitizeUserForClient,
} from "@/lib/veritas-engine/identity-rbac";
import { hashPassword, verifyPassword } from "@/lib/veritas-engine/password-crypto";
import {
  recordActivityLog,
  resolveAuthenticatedUser,
  SESSION_COOKIE_NAME,
} from "@/lib/veritas-engine/server-auth";
import {
  AccountStatus,
  AuthorshipProof,
  StudyNote,
  UserRole,
  VeritasActivityLog,
  VeritasClass,
  VeritasEnrollment,
  VeritasSession,
  VeritasUser,
} from "@/lib/veritas-engine/types";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    const supabase = getSupabaseAdmin();
    if (!supabase) {
      return NextResponse.json(
        { error: "Banco Supabase indisponivel para gestao de contas." },
        { status: 503 }
      );
    }

    const auth = await resolveAuthenticatedUser(request, supabase);
    if (!auth.user) {
      return NextResponse.json(
        { error: "Sessao nao autenticada. Faca login primeiro." },
        { status: 401 }
      );
    }
    if (auth.user.account_status !== "ativa") {
      return NextResponse.json(
        { error: "Conta sem permissao ativa para alterar configuracoes." },
        { status: 403 }
      );
    }

    const body = await request.json();
    const action = String(body.action ?? "").trim();
    const targetUserId = String(body.targetUserId ?? auth.user.id).trim();
    const nowIso = new Date().toISOString();

    if (action === "update_settings") {
      const isSelf = targetUserId === auth.user.id;
      const isAdmin = auth.user.role === "administrador";
      if (!isSelf && !isAdmin) {
        return NextResponse.json(
          { error: "Permissao negada: voce so pode alterar a sua propria conta." },
          { status: 403 }
        );
      }

      const { data: targetRow } = await supabase
        .from("veritas_users")
        .select("*")
        .eq("id", targetUserId)
        .maybeSingle();

      if (!targetRow) {
        return NextResponse.json({ error: "Usuario nao encontrado." }, { status: 404 });
      }

      const target = targetRow as VeritasUser;
      const section = String(body.section ?? "").trim();
      const payload = (body.payload || {}) as Record<string, unknown>;
      const patch: Record<string, unknown> = { updated_at: nowIso };

      if (section === "conta") {
        const nextEmail = String(payload.email ?? target.email).trim().toLowerCase();
        const nextUsername = String(payload.username ?? target.username)
          .trim()
          .toLowerCase();
        const nextFullName = String(payload.full_name ?? target.full_name).trim();
        const nextPhone = formatPhoneBR(String(payload.phone ?? target.phone));

        if (nextFullName.length < 4) {
          return NextResponse.json(
            { error: "Nome completo deve ter ao menos 4 caracteres." },
            { status: 400 }
          );
        }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(nextEmail)) {
          return NextResponse.json({ error: "E-mail invalido." }, { status: 400 });
        }
        if (!/^[a-z0-9._-]{3,32}$/.test(nextUsername)) {
          return NextResponse.json(
            { error: "Nome de usuario invalido (3 a 32 caracteres)." },
            { status: 400 }
          );
        }

        const { data: dupRows } = await supabase
          .from("veritas_users")
          .select("id,email,username,account_status")
          .neq("id", target.id);
        const others = (dupRows || []) as Array<{
          id: string;
          email: string;
          username: string;
          account_status: string;
        }>;
        if (
          others.some(
            (o) => o.email.toLowerCase() === nextEmail && o.account_status !== "excluida"
          )
        ) {
          return NextResponse.json(
            { error: "Outro usuario ja utiliza este e-mail." },
            { status: 409 }
          );
        }
        if (
          others.some(
            (o) =>
              o.username.toLowerCase() === nextUsername && o.account_status !== "excluida"
          )
        ) {
          return NextResponse.json(
            { error: "Nome de usuario ja cadastrado por outra conta." },
            { status: 409 }
          );
        }

        patch.full_name = nextFullName;
        patch.email = nextEmail;
        patch.username = nextUsername;
        patch.phone = nextPhone;

        if (payload.new_password) {
          const currentPwd = String(payload.current_password ?? "");
          const newPwd = String(payload.new_password ?? "");
          const confirmPwd = String(payload.confirm_password ?? "");
          if (!isAdmin && !verifyPassword(currentPwd, target.password_hash)) {
            return NextResponse.json(
              { error: "Senha atual incorreta." },
              { status: 400 }
            );
          }
          if (newPwd.length < 6 || newPwd !== confirmPwd) {
            return NextResponse.json(
              { error: "A nova senha precisa ter ao menos 6 caracteres e coincidir com a confirmacao." },
              { status: 400 }
            );
          }
          patch.password_hash = hashPassword(newPwd);
          patch.security_settings = {
            ...target.security_settings,
            last_password_change: nowIso,
          };
        }
      } else if (section === "perfil") {
        patch.social_name = String(payload.social_name ?? target.social_name).trim();
        patch.avatar_url = String(payload.avatar_url ?? target.avatar_url).trim();
        patch.bio = String(payload.bio ?? target.bio).trim();
        patch.birth_date = String(payload.birth_date ?? target.birth_date).trim();
        patch.institution = String(payload.institution ?? target.institution).trim();
        patch.country = String(payload.country ?? target.country).trim();
        patch.state = String(payload.state ?? target.state).trim();
        patch.city = String(payload.city ?? target.city).trim();
        patch.address = String(payload.address ?? target.address).trim();

        if (target.role === "aluno" && payload.student_profile) {
          patch.student_profile = {
            ...target.student_profile,
            ...(payload.student_profile as Record<string, unknown>),
          };
        }
        if (target.role === "professor" && payload.teacher_profile) {
          patch.teacher_profile = {
            ...target.teacher_profile,
            ...(payload.teacher_profile as Record<string, unknown>),
          };
        }
        if (target.role === "administrador" && payload.admin_profile && isAdmin) {
          patch.admin_profile = {
            ...target.admin_profile,
            ...(payload.admin_profile as Record<string, unknown>),
          };
        }
      } else if (section === "privacidade") {
        patch.privacy_settings = {
          ...target.privacy_settings,
          ...payload,
        };
      } else if (section === "notificacoes") {
        patch.notification_settings = {
          ...target.notification_settings,
          ...payload,
        };
      } else if (section === "seguranca") {
        patch.security_settings = {
          ...target.security_settings,
          two_factor_enabled:
            typeof payload.two_factor_enabled === "boolean"
              ? payload.two_factor_enabled
              : target.security_settings.two_factor_enabled,
          two_factor_method:
            (payload.two_factor_method as VeritasUser["security_settings"]["two_factor_method"]) ||
            target.security_settings.two_factor_method,
        };
        if (payload.new_password) {
          const currentPwd = String(payload.current_password ?? "");
          const newPwd = String(payload.new_password ?? "");
          const confirmPwd = String(payload.confirm_password ?? "");
          if (!isAdmin && !verifyPassword(currentPwd, target.password_hash)) {
            return NextResponse.json(
              { error: "Senha atual incorreta." },
              { status: 400 }
            );
          }
          if (newPwd.length < 6 || newPwd !== confirmPwd) {
            return NextResponse.json(
              { error: "Nova senha invalida ou confirmacao divergente." },
              { status: 400 }
            );
          }
          patch.password_hash = hashPassword(newPwd);
          (patch.security_settings as Record<string, unknown>).last_password_change =
            nowIso;
        }
      } else if (section === "aparencia") {
        patch.appearance_settings = {
          ...target.appearance_settings,
          ...payload,
        };
      } else if (section === "preferencias_estudo") {
        patch.study_preferences = {
          ...target.study_preferences,
          ...payload,
        };
      } else {
        return NextResponse.json(
          { error: "Secao de configuracao desconhecida." },
          { status: 400 }
        );
      }

      const { data: updated, error: upErr } = await supabase
        .from("veritas_users")
        .update(patch)
        .eq("id", target.id)
        .select()
        .single();

      if (upErr || !updated) {
        return NextResponse.json(
          { error: upErr?.message || "Erro ao salvar configuracoes." },
          { status: 500 }
        );
      }

      await recordActivityLog(supabase, {
        userId: auth.user.id,
        userName: auth.user.full_name,
        userRole: auth.user.role,
        actionType: `config_${section}`,
        description: `Atualizou a secao '${section}' nas configuracoes de conta.`,
      });

      return NextResponse.json({
        user: sanitizeUserForClient(updated as VeritasUser),
        message: "Configuracoes atualizadas com sucesso.",
      });
    }

    if (action === "terminate_session") {
      const sessionId = body.sessionId ? String(body.sessionId) : "";
      const revokeAllOthers = Boolean(body.revokeAllOthers);

      if (revokeAllOthers) {
        let query = supabase
          .from("veritas_sessions")
          .update({ is_active: false, last_seen_at: nowIso })
          .eq("user_id", auth.user.id);
        if (auth.session?.id) {
          query = query.neq("id", auth.session.id);
        }
        await query;
      } else if (sessionId) {
        const { data: sess } = await supabase
          .from("veritas_sessions")
          .select("*")
          .eq("id", sessionId)
          .maybeSingle();

        if (!sess) {
          return NextResponse.json({ error: "Sessao nao encontrada." }, { status: 404 });
        }
        if (sess.user_id !== auth.user.id && auth.user.role !== "administrador") {
          return NextResponse.json(
            { error: "Sem permissao para encerrar sessao de outro usuario." },
            { status: 403 }
          );
        }
        await supabase
          .from("veritas_sessions")
          .update({ is_active: false, last_seen_at: nowIso })
          .eq("id", sessionId);
      }

      await recordActivityLog(supabase, {
        userId: auth.user.id,
        userName: auth.user.full_name,
        userRole: auth.user.role,
        actionType: "encerrar_sessao",
        description: revokeAllOthers
          ? "Encerrou todas as demais sessoes ativas."
          : "Encerrou uma sessao conectada.",
      });

      return NextResponse.json({ message: "Sessao encerrada." });
    }

    if (action === "admin_update_account") {
      if (!canPerformAction(auth.user, "manage_users")) {
        return NextResponse.json(
          { error: "Acesso negado: apenas administradores podem moderar contas." },
          { status: 403 }
        );
      }

      const { data: targetRow } = await supabase
        .from("veritas_users")
        .select("*")
        .eq("id", targetUserId)
        .maybeSingle();
      if (!targetRow) {
        return NextResponse.json({ error: "Conta nao encontrada." }, { status: 404 });
      }
      const target = targetRow as VeritasUser;

      const nextStatus = body.account_status as AccountStatus | undefined;
      const nextRole = body.role as UserRole | undefined;
      const nextVerified =
        typeof body.email_verified === "boolean" ? body.email_verified : target.email_verified;

      if (
        nextStatus === "suspensa" ||
        nextStatus === "bloqueada" ||
        nextStatus === "excluida"
      ) {
        if (target.id === auth.user.id) {
          return NextResponse.json(
            { error: "Nao e permitido bloquear ou suspender o proprio usuario administrador ativo." },
            { status: 400 }
          );
        }
      }

      const patch: Record<string, unknown> = {
        account_status: nextStatus || target.account_status,
        role: nextRole || target.role,
        email_verified: nextVerified,
        updated_at: nowIso,
      };

      if (body.access_level || body.admin_permissions) {
        patch.admin_profile = {
          ...target.admin_profile,
          access_level: body.access_level || target.admin_profile.access_level,
          admin_permissions:
            body.admin_permissions || target.admin_profile.admin_permissions,
        };
      }

      const { data: updated, error: err } = await supabase
        .from("veritas_users")
        .update(patch)
        .eq("id", target.id)
        .select()
        .single();

      if (err) {
        return NextResponse.json({ error: err.message }, { status: 500 });
      }

      if (nextStatus && nextStatus !== "ativa") {
        await supabase
          .from("veritas_sessions")
          .update({ is_active: false })
          .eq("user_id", target.id);
      }

      await recordActivityLog(supabase, {
        userId: auth.user.id,
        userName: auth.user.full_name,
        userRole: auth.user.role,
        actionType: "admin_rbac",
        description: `Moderou conta ${target.full_name}: status=${patch.account_status}, papel=${patch.role}.`,
      });

      return NextResponse.json({
        user: sanitizeUserForClient(updated as VeritasUser),
        message: "Conta atualizada pela administracao.",
      });
    }

    if (action === "export_lgpd") {
      if (!canPerformAction(auth.user, "export_lgpd", targetUserId)) {
        return NextResponse.json(
          { error: "Voce so pode exportar seus proprios dados pessoais." },
          { status: 403 }
        );
      }

      const [
        userRes,
        enrollRes,
        classesRes,
        notesRes,
        proofsRes,
        sessRes,
        logsRes,
      ] = await Promise.all([
        supabase.from("veritas_users").select("*").eq("id", targetUserId).maybeSingle(),
        supabase.from("veritas_class_enrollments").select("*"),
        supabase.from("veritas_classes").select("*"),
        supabase.from("veritas_study_notes").select("*"),
        supabase.from("veritas_authorship_proofs").select("*"),
        supabase.from("veritas_sessions").select("*"),
        supabase.from("veritas_activity_logs").select("*"),
      ]);

      if (!userRes.data) {
        return NextResponse.json({ error: "Usuario nao encontrado." }, { status: 404 });
      }

      const pkg = buildLgpdExportPackage({
        user: userRes.data as VeritasUser,
        enrollments: (enrollRes.data as VeritasEnrollment[]) || [],
        classes: (classesRes.data as VeritasClass[]) || [],
        notes: (notesRes.data as StudyNote[]) || [],
        proofs: (proofsRes.data as AuthorshipProof[]) || [],
        sessions: (sessRes.data as VeritasSession[]) || [],
        activityLogs: (logsRes.data as VeritasActivityLog[]) || [],
      });

      await recordActivityLog(supabase, {
        userId: auth.user.id,
        userName: auth.user.full_name,
        userRole: auth.user.role,
        actionType: "exportacao_lgpd",
        description: "Exportou pacote completo de dados pessoais (LGPD Art. 18).",
      });

      return NextResponse.json({ lgpdPackage: pkg });
    }

    if (action === "delete_account") {
      const confirmation = String(body.confirmation ?? "").trim().toUpperCase();
      if (confirmation !== "EXCLUIR") {
        return NextResponse.json(
          { error: "Digite EXCLUIR para confirmar a exclusao definitiva da conta." },
          { status: 400 }
        );
      }

      const canDelete =
        targetUserId === auth.user.id || canPerformAction(auth.user, "manage_users");
      if (!canDelete) {
        return NextResponse.json({ error: "Permissao negada." }, { status: 403 });
      }

      const { data: targetRow } = await supabase
        .from("veritas_users")
        .select("*")
        .eq("id", targetUserId)
        .maybeSingle();
      if (!targetRow) {
        return NextResponse.json({ error: "Conta nao encontrada." }, { status: 404 });
      }
      const target = targetRow as VeritasUser;

      await supabase
        .from("veritas_users")
        .update({
          account_status: "excluida",
          phone: "",
          address: "",
          bio: "Conta anonimizada a pedido do titular (LGPD).",
          updated_at: nowIso,
        })
        .eq("id", target.id);

      await supabase
        .from("veritas_sessions")
        .update({ is_active: false })
        .eq("user_id", target.id);

      await recordActivityLog(supabase, {
        userId: auth.user.id,
        userName: auth.user.full_name,
        userRole: auth.user.role,
        actionType: "exclusao_lgpd",
        description: `Conta ${target.username} marcada como excluida (LGPD).`,
      });

      const res = NextResponse.json({
        deleted: true,
        message: "Conta excluida e sessoes encerradas conforme LGPD.",
      });
      if (target.id === auth.user.id) {
        res.cookies.delete(SESSION_COOKIE_NAME);
      }
      return res;
    }

    return NextResponse.json({ error: "Acao de usuario invalida." }, { status: 400 });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Erro ao processar gestao de usuario." },
      { status: 500 }
    );
  }
}
