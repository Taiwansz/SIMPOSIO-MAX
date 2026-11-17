import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase/server";
import { analyzeStudentNote } from "@/lib/veritas-engine/study-notebook";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const studentName = String(body.studentName ?? "Matheus Sousa dos Santos").trim();
    const ra = String(body.ra ?? "52319400").trim();
    const subjectName = String(body.subjectName ?? "Sistemas Operacionais").trim();
    const examDaysLeft = Math.max(0, Math.min(180, Number(body.examDaysLeft ?? 7)));
    const noteTitle = String(body.noteTitle ?? "Anotacao de Aula").trim();
    const noteContent = String(body.noteContent ?? "").trim();

    if (noteContent.length < 8) {
      return NextResponse.json(
        { error: "Escreva pelo menos 1 frase na sua anotacao antes de analisar." },
        { status: 400 }
      );
    }

    const analysis = analyzeStudentNote({
      subjectName,
      noteTitle,
      noteContent,
      examDaysLeft,
    });

    const supabase = getSupabaseAdmin();
    let noteRecord = {
      id: `local-${Date.now()}`,
      student_name: studentName,
      ra,
      subject_name: subjectName,
      exam_days_left: examDaysLeft,
      exam_date_label: analysis.examDateLabel,
      note_title: noteTitle,
      note_content: noteContent,
      copilot_strength: analysis.strength,
      copilot_blindspot: analysis.blindspot,
      copilot_question: analysis.question,
      readiness_pct: analysis.readinessPct,
      created_at: new Date().toISOString(),
    };

    if (supabase) {
      const { data } = await supabase
        .from("veritas_study_notes")
        .insert({
          student_name: studentName,
          ra,
          subject_name: subjectName,
          exam_days_left: examDaysLeft,
          exam_date_label: analysis.examDateLabel,
          note_title: noteTitle,
          note_content: noteContent,
          copilot_strength: analysis.strength,
          copilot_blindspot: analysis.blindspot,
          copilot_question: analysis.question,
          readiness_pct: analysis.readinessPct,
        })
        .select()
        .single();
      if (data) noteRecord = data;
    }

    return NextResponse.json({
      note: noteRecord,
      persisted: Boolean(supabase),
    });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Erro ao salvar anotacao." },
      { status: 500 }
    );
  }
}
