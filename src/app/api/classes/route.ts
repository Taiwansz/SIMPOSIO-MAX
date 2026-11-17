import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase/server";
import {
  canPerformAction,
  normalizeCode,
} from "@/lib/veritas-engine/identity-rbac";
import {
  recordActivityLog,
  resolveAuthenticatedUser,
} from "@/lib/veritas-engine/server-auth";
import {
  ClassAnnouncement,
  ClassStatus,
  EnrollmentStatus,
  ShiftType,
  VeritasClass,
  VeritasEnrollment,
} from "@/lib/veritas-engine/types";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    const supabase = getSupabaseAdmin();
    if (!supabase) {
      return NextResponse.json(
        { error: "Banco Supabase indisponivel para gestao de turmas." },
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

    const body = await request.json();
    const action = String(body.action ?? "").trim();
    const nowIso = new Date().toISOString();

    if (action === "create_class") {
      if (!canPerformAction(auth.user, "create_class")) {
        return NextResponse.json(
          { error: "Permissao negada: apenas professores ou administradores criam turmas." },
          { status: 403 }
        );
      }

      const name = String(body.name ?? "").trim();
      const rawCode = String(body.code ?? "").trim();
      const code =
        normalizeCode(rawCode) ||
        `VRT-${Math.floor(1000 + Math.random() * 8999)}`;
      const description = String(body.description ?? "").trim();
      const institution =
        String(body.institution ?? auth.user.institution).trim() ||
        auth.user.institution;
      const subject = String(body.subject ?? "").trim();
      const maxParticipants = Math.max(
        1,
        Math.min(500, Number(body.max_participants ?? 45))
      );
      const academicPeriod = String(body.academic_period ?? "2026.2").trim();
      const startDate = String(body.start_date ?? "2026-08-03").trim();
      const endDate = String(body.end_date ?? "2026-12-12").trim();
      const shift = (body.shift as ShiftType) || "Noturno";

      if (name.length < 3 || subject.length < 2) {
        return NextResponse.json(
          { error: "Informe nome da turma e disciplina validos." },
          { status: 400 }
        );
      }

      const { data: dupCode } = await supabase
        .from("veritas_classes")
        .select("id")
        .eq("code", code)
        .maybeSingle();
      if (dupCode) {
        return NextResponse.json(
          { error: `O codigo ${code} ja esta vinculado a outra turma.` },
          { status: 409 }
        );
      }

      const { data: created, error: createErr } = await supabase
        .from("veritas_classes")
        .insert({
          name,
          code,
          description,
          institution,
          subject,
          responsible_teacher_id: auth.user.id,
          responsible_teacher_name: auth.user.full_name,
          max_participants: maxParticipants,
          academic_period: academicPeriod,
          start_date: startDate,
          end_date: endDate,
          shift,
          status: "ativa",
          announcements: [],
          created_at: nowIso,
          updated_at: nowIso,
        })
        .select()
        .single();

      if (createErr || !created) {
        return NextResponse.json(
          { error: createErr?.message || "Falha ao criar turma." },
          { status: 500 }
        );
      }

      await recordActivityLog(supabase, {
        userId: auth.user.id,
        userName: auth.user.full_name,
        userRole: auth.user.role,
        actionType: "criar_turma",
        description: `Criou a turma ${name} (${code}).`,
      });

      return NextResponse.json({
        classroom: created as VeritasClass,
        message: `Turma ${name} criada com codigo ${code}.`,
      });
    }

    if (action === "update_class") {
      const classId = String(body.classId ?? "").trim();
      const { data: clsRow } = await supabase
        .from("veritas_classes")
        .select("*")
        .eq("id", classId)
        .maybeSingle();

      if (!clsRow) {
        return NextResponse.json({ error: "Turma nao encontrada." }, { status: 404 });
      }
      const cls = clsRow as VeritasClass;
      if (!canPerformAction(auth.user, "manage_class", cls.responsible_teacher_id)) {
        return NextResponse.json(
          { error: "Permissao negada: voce nao e o docente responsavel por esta turma." },
          { status: 403 }
        );
      }

      const nextStatus = (body.status as ClassStatus) || cls.status;
      const patch = {
        name: body.name !== undefined ? String(body.name).trim() : cls.name,
        description:
          body.description !== undefined
            ? String(body.description).trim()
            : cls.description,
        institution:
          body.institution !== undefined
            ? String(body.institution).trim()
            : cls.institution,
        subject:
          body.subject !== undefined ? String(body.subject).trim() : cls.subject,
        max_participants:
          body.max_participants !== undefined
            ? Math.max(1, Math.min(500, Number(body.max_participants)))
            : cls.max_participants,
        academic_period:
          body.academic_period !== undefined
            ? String(body.academic_period).trim()
            : cls.academic_period,
        start_date:
          body.start_date !== undefined ? String(body.start_date).trim() : cls.start_date,
        end_date:
          body.end_date !== undefined ? String(body.end_date).trim() : cls.end_date,
        shift: (body.shift as ShiftType) || cls.shift,
        status: nextStatus,
        updated_at: nowIso,
      };

      const { data: updated, error: upErr } = await supabase
        .from("veritas_classes")
        .update(patch)
        .eq("id", cls.id)
        .select()
        .single();

      if (upErr) {
        return NextResponse.json({ error: upErr.message }, { status: 500 });
      }

      await recordActivityLog(supabase, {
        userId: auth.user.id,
        userName: auth.user.full_name,
        userRole: auth.user.role,
        actionType: "atualizar_turma",
        description: `Atualizou a turma ${cls.code} (status: ${nextStatus}).`,
      });

      return NextResponse.json({
        classroom: updated as VeritasClass,
        message: "Turma atualizada.",
      });
    }

    if (action === "delete_class") {
      const classId = String(body.classId ?? "").trim();
      const { data: clsRow } = await supabase
        .from("veritas_classes")
        .select("*")
        .eq("id", classId)
        .maybeSingle();

      if (!clsRow) {
        return NextResponse.json({ error: "Turma nao encontrada." }, { status: 404 });
      }
      const cls = clsRow as VeritasClass;
      if (!canPerformAction(auth.user, "manage_class", cls.responsible_teacher_id)) {
        return NextResponse.json(
          { error: "Permissao negada para excluir esta turma." },
          { status: 403 }
        );
      }

      await supabase.from("veritas_classes").delete().eq("id", cls.id);
      await recordActivityLog(supabase, {
        userId: auth.user.id,
        userName: auth.user.full_name,
        userRole: auth.user.role,
        actionType: "excluir_turma",
        description: `Excluiu a turma ${cls.name} (${cls.code}).`,
      });

      return NextResponse.json({ deleted: true, message: "Turma excluida." });
    }

    if (action === "request_join") {
      if (!canPerformAction(auth.user, "request_class_join")) {
        return NextResponse.json(
          { error: "Apenas contas de alunos ativas podem solicitar entrada em turmas." },
          { status: 403 }
        );
      }

      const inviteCode = normalizeCode(String(body.inviteCode ?? ""));
      const classId = String(body.classId ?? "").trim();
      const message = String(body.message ?? "Solicito entrada na turma.").trim();

      let targetClass: VeritasClass | null = null;
      if (inviteCode) {
        const { data } = await supabase
          .from("veritas_classes")
          .select("*")
          .eq("code", inviteCode)
          .maybeSingle();
        targetClass = (data as VeritasClass) || null;
      } else if (classId) {
        const { data } = await supabase
          .from("veritas_classes")
          .select("*")
          .eq("id", classId)
          .maybeSingle();
        targetClass = (data as VeritasClass) || null;
      }

      if (!targetClass) {
        return NextResponse.json(
          { error: "Codigo de convite nao encontrado." },
          { status: 404 }
        );
      }
      if (targetClass.status !== "ativa") {
        return NextResponse.json(
          { error: "Esta turma nao esta recebendo novas solicitacoes no momento." },
          { status: 400 }
        );
      }

      const { data: classEnrolls } = await supabase
        .from("veritas_class_enrollments")
        .select("*")
        .eq("class_id", targetClass.id);

      const enrollmentsList = (classEnrolls as VeritasEnrollment[]) || [];
      const approvedCount = enrollmentsList.filter(
        (e) => e.membership_status === "aprovado"
      ).length;
      if (approvedCount >= targetClass.max_participants) {
        return NextResponse.json(
          { error: "Limite de participantes atingido para esta turma." },
          { status: 409 }
        );
      }

      const existing = enrollmentsList.find((e) => e.student_id === auth.user?.id);
      if (existing) {
        if (existing.membership_status === "aprovado") {
          return NextResponse.json(
            { error: "Voce ja faz parte desta turma." },
            { status: 409 }
          );
        }
        if (existing.membership_status === "pendente") {
          return NextResponse.json(
            { error: "Sua solicitacao ja esta aguardando aprovacao do professor." },
            { status: 409 }
          );
        }

        const { data: updatedEnroll } = await supabase
          .from("veritas_class_enrollments")
          .update({
            membership_status: "pendente",
            invite_code_used: inviteCode || targetClass.code,
            message,
            requested_at: nowIso,
            decided_at: null,
          })
          .eq("id", existing.id)
          .select()
          .single();

        return NextResponse.json({
          enrollment: updatedEnroll,
          message: `Nova solicitacao enviada para ${targetClass.name}.`,
        });
      }

      const { data: createdEnroll, error: enErr } = await supabase
        .from("veritas_class_enrollments")
        .insert({
          class_id: targetClass.id,
          student_id: auth.user.id,
          student_name: auth.user.full_name,
          student_ra: auth.user.identification_code || auth.user.student_profile?.registration_code || "",
          membership_status: "pendente",
          invite_code_used: inviteCode || targetClass.code,
          message,
          requested_at: nowIso,
          decided_at: null,
        })
        .select()
        .single();

      if (enErr) {
        return NextResponse.json({ error: enErr.message }, { status: 500 });
      }

      await recordActivityLog(supabase, {
        userId: auth.user.id,
        userName: auth.user.full_name,
        userRole: auth.user.role,
        actionType: "solicitacao_turma",
        description: `Solicitou ingresso na turma ${targetClass.name} (${targetClass.code}).`,
      });

      return NextResponse.json({
        enrollment: createdEnroll,
        message: `Solicitacao enviada para ${targetClass.name}. Aguarde aprovacao docente.`,
      });
    }

    if (action === "decide_enrollment") {
      const enrollmentId = String(body.enrollmentId ?? "").trim();
      const decision = body.decision as EnrollmentStatus;
      if (!["aprovado", "recusado", "removido"].includes(decision)) {
        return NextResponse.json({ error: "Decisao de matricula invalida." }, { status: 400 });
      }

      const { data: enRow } = await supabase
        .from("veritas_class_enrollments")
        .select("*")
        .eq("id", enrollmentId)
        .maybeSingle();
      if (!enRow) {
        return NextResponse.json({ error: "Solicitacao nao encontrada." }, { status: 404 });
      }
      const enroll = enRow as VeritasEnrollment;

      const { data: clsRow } = await supabase
        .from("veritas_classes")
        .select("*")
        .eq("id", enroll.class_id)
        .maybeSingle();
      if (!clsRow) {
        return NextResponse.json({ error: "Turma nao encontrada." }, { status: 404 });
      }
      const cls = clsRow as VeritasClass;

      if (!canPerformAction(auth.user, "approve_enrollment", cls.responsible_teacher_id)) {
        return NextResponse.json(
          { error: "Permissao negada: apenas o docente responsavel ou administrador decide." },
          { status: 403 }
        );
      }

      if (decision === "aprovado") {
        const { count } = await supabase
          .from("veritas_class_enrollments")
          .select("id", { count: "exact", head: true })
          .eq("class_id", cls.id)
          .eq("membership_status", "aprovado");
        if ((count ?? 0) >= cls.max_participants) {
          return NextResponse.json(
            { error: "Capacidade maxima da turma atingida." },
            { status: 409 }
          );
        }
      }

      const { data: updatedEnroll, error: upErr } = await supabase
        .from("veritas_class_enrollments")
        .update({
          membership_status: decision,
          decided_at: nowIso,
        })
        .eq("id", enroll.id)
        .select()
        .single();

      if (upErr) {
        return NextResponse.json({ error: upErr.message }, { status: 500 });
      }

      await recordActivityLog(supabase, {
        userId: auth.user.id,
        userName: auth.user.full_name,
        userRole: auth.user.role,
        actionType: "decisao_matricula",
        description: `${decision.toUpperCase()} ingresso de ${enroll.student_name} em ${cls.code}.`,
      });

      return NextResponse.json({
        enrollment: updatedEnroll,
        message: `Status de ${enroll.student_name} atualizado para ${decision}.`,
      });
    }

    if (action === "post_announcement") {
      const classId = String(body.classId ?? "").trim();
      const title = String(body.title ?? "").trim();
      const content = String(body.content ?? "").trim();
      const kind = (body.kind as ClassAnnouncement["kind"]) || "aviso";
      const dueDate = body.due_date ? String(body.due_date).trim() : undefined;

      if (title.length < 3 || content.length < 5) {
        return NextResponse.json(
          { error: "Informe titulo e conteudo do comunicado." },
          { status: 400 }
        );
      }

      const { data: clsRow } = await supabase
        .from("veritas_classes")
        .select("*")
        .eq("id", classId)
        .maybeSingle();
      if (!clsRow) {
        return NextResponse.json({ error: "Turma nao encontrada." }, { status: 404 });
      }
      const cls = clsRow as VeritasClass;

      if (!canPerformAction(auth.user, "post_announcement", cls.responsible_teacher_id)) {
        return NextResponse.json(
          { error: "Permissao negada para publicar nesta turma." },
          { status: 403 }
        );
      }

      const nextAnnouncement: ClassAnnouncement = {
        id: `ann-${Date.now()}`,
        author_name: auth.user.full_name,
        title,
        content,
        kind,
        due_date: dueDate,
        created_at: nowIso,
      };

      const nextList = [nextAnnouncement, ...(cls.announcements || [])];
      const { data: updatedCls, error: upErr } = await supabase
        .from("veritas_classes")
        .update({ announcements: nextList, updated_at: nowIso })
        .eq("id", cls.id)
        .select()
        .single();

      if (upErr) {
        return NextResponse.json({ error: upErr.message }, { status: 500 });
      }

      await recordActivityLog(supabase, {
        userId: auth.user.id,
        userName: auth.user.full_name,
        userRole: auth.user.role,
        actionType: "turma_comunicado",
        description: `Publicou "${title}" na turma ${cls.code}.`,
      });

      return NextResponse.json({
        classroom: updatedCls as VeritasClass,
        message: "Comunicado publicado na turma.",
      });
    }

    return NextResponse.json({ error: "Acao de turma invalida." }, { status: 400 });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Erro ao processar gestao de turmas." },
      { status: 500 }
    );
  }
}
