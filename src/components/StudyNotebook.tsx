"use client";

import React, { useMemo, useState } from "react";
import { ArrowUpRight, BookOpen, Calendar, Plus, Sparkles } from "lucide-react";
import { StudyNote } from "@/lib/veritas-engine/types";

interface StudyNotebookProps {
  notes: StudyNote[];
  onNoteSaved: () => Promise<void>;
  onTestNoteInMutation: (noteContent: string, noteTitle: string) => void;
}

export default function StudyNotebook({
  notes,
  onNoteSaved,
  onTestNoteInMutation,
}: StudyNotebookProps) {
  const [selectedId, setSelectedId] = useState(notes[0]?.id ?? "");
  const [creatingNew, setCreatingNew] = useState(false);

  const selectedNote = useMemo(
    () => notes.find((n) => n.id === selectedId) ?? notes[0],
    [notes, selectedId]
  );

  const [subjectName, setSubjectName] = useState(selectedNote?.subject_name ?? "Sistemas Operacionais");
  const [examDaysLeft, setExamDaysLeft] = useState(selectedNote?.exam_days_left ?? 5);
  const [noteTitle, setNoteTitle] = useState(selectedNote?.note_title ?? "");
  const [noteContent, setNoteContent] = useState(selectedNote?.note_content ?? "");
  const [saving, setSaving] = useState(false);

  const selectExisting = (note: StudyNote) => {
    setCreatingNew(false);
    setSelectedId(note.id);
    setSubjectName(note.subject_name);
    setExamDaysLeft(note.exam_days_left);
    setNoteTitle(note.note_title);
    setNoteContent(note.note_content);
  };

  const startNewNote = () => {
    setCreatingNew(true);
    setSubjectName("Banco de Dados");
    setExamDaysLeft(4);
    setNoteTitle("");
    setNoteContent("");
  };

  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault();
    if (noteContent.trim().length < 8) return;
    setSaving(true);
    try {
      const res = await fetch("/api/notebook", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          subjectName: subjectName.trim() || "Materia",
          examDaysLeft,
          noteTitle: noteTitle.trim() || "Anotacao de Aula",
          noteContent,
        }),
      });
      const data = await res.json();
      if (res.ok && data.note) {
        setCreatingNew(false);
        setSelectedId(data.note.id);
        await onNoteSaved();
      }
    } finally {
      setSaving(false);
    }
  };

  const activeDisplay = creatingNew ? null : selectedNote;

  return (
    <div className="space-y-6">
      {/* Cabecalho simples */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h2 className="font-display text-2xl font-semibold text-[#F0EDE6] sm:text-3xl">
            Caderno e Provas
          </h2>
          <p className="mt-1 text-sm text-[#F0EDE6]/60">
            Anote sua aula e acompanhe provas. A IA nao resume por voce — ela mostra o que faltou estudar.
          </p>
        </div>

        <button
          type="button"
          onClick={startNewNote}
          className="inline-flex w-fit items-center gap-2 rounded-full bg-[#2A2A2A]/80 px-4 py-2.5 text-xs font-medium text-[#F0EDE6] transition hover:bg-[#C8B560] hover:text-[#0A0A0A]"
        >
          <Plus className="h-4 w-4" strokeWidth={1.8} />
          <span>Nova anotacao</span>
        </button>
      </div>

      {/* Lista enxuta de materias e provas (sem pilulas poluidas) */}
      <div className="flex flex-wrap gap-2">
        {notes.map((n) => {
          const active = !creatingNew && n.id === selectedNote?.id;
          return (
            <button
              key={n.id}
              type="button"
              onClick={() => selectExisting(n)}
              className={`flex items-center gap-3 rounded-2xl px-4 py-2.5 text-left text-xs transition-all duration-200 ${
                active
                  ? "bg-[#F0EDE6] font-medium text-[#0A0A0A]"
                  : "bg-[#2A2A2A]/55 text-[#F0EDE6]/75 hover:bg-[#2A2A2A] hover:text-[#F0EDE6]"
              }`}
            >
              <span>{n.subject_name}</span>
              <span
                className={`font-mono text-[11px] tabular-nums ${
                  active ? "text-[#0A0A0A]/65" : "text-[#C8B560]"
                }`}
              >
                {n.exam_days_left}d
              </span>
            </button>
          );
        })}
      </div>

      {/* 2 Blocos Limpos: Esquerda (Editor da Anotacao) + Direita (Copiloto ThSyr) */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        <div className="apple-shell lg:col-span-7">
          <form onSubmit={handleAnalyze} className="apple-card flex h-full flex-col justify-between space-y-4 p-6">
            <div className="space-y-4">
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                <input
                  type="text"
                  value={subjectName}
                  onChange={(e) => setSubjectName(e.target.value)}
                  placeholder="Materia"
                  className="rounded-2xl bg-[#0A0A0A] px-4 py-2.5 text-xs text-[#F0EDE6] outline-none ring-1 ring-[#5C5C5C]/40 focus:ring-[#C8B560] sm:col-span-2"
                />
                <label className="flex items-center justify-between rounded-2xl bg-[#0A0A0A] px-4 py-2.5 text-xs text-[#F0EDE6]/60 ring-1 ring-[#5C5C5C]/40">
                  <span>Prova em</span>
                  <span className="flex items-center gap-1 font-mono text-[#C8B560]">
                    <input
                      type="number"
                      min={0}
                      max={180}
                      value={examDaysLeft}
                      onChange={(e) => setExamDaysLeft(Number(e.target.value))}
                      className="w-10 bg-transparent text-right font-semibold outline-none [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                    />
                    <span>d</span>
                  </span>
                </label>
              </div>

              <input
                type="text"
                value={noteTitle}
                onChange={(e) => setNoteTitle(e.target.value)}
                placeholder="Titulo da aula ou topico..."
                className="w-full rounded-2xl bg-[#0A0A0A] px-4 py-3 text-sm font-medium text-[#F0EDE6] outline-none ring-1 ring-[#5C5C5C]/40 focus:ring-[#C8B560]"
              />

              <textarea
                rows={6}
                required
                value={noteContent}
                onChange={(e) => setNoteContent(e.target.value)}
                placeholder="Escreva com suas palavras o que aprendeu na aula (1 linha por ideia)..."
                className="w-full rounded-2xl bg-[#0A0A0A] p-4 text-sm leading-relaxed text-[#F0EDE6] outline-none ring-1 ring-[#5C5C5C]/40 focus:ring-[#C8B560]"
              />
            </div>

            <button
              type="submit"
              disabled={saving || noteContent.trim().length < 8}
              className="flex w-full items-center justify-center gap-2 rounded-full bg-[#C8B560] py-3.5 text-sm font-semibold text-[#0A0A0A] transition-all duration-300 apple-ease hover:bg-[#F0EDE6] active:scale-[0.97] disabled:opacity-40"
            >
              <Sparkles className="h-4 w-4" strokeWidth={1.8} />
              <span>{saving ? "Analisando..." : "Salvar e analisar anotacao"}</span>
            </button>
          </form>
        </div>

        {/* Copiloto Critico da Anotacao */}
        <div className="apple-shell lg:col-span-5">
          <div className="apple-card flex h-full flex-col justify-between space-y-5 p-6">
            {activeDisplay ? (
              <>
                <div className="space-y-5">
                  <div className="flex items-start justify-between border-b border-[#5C5C5C]/25 pb-4">
                    <div>
                      <div className="flex items-center gap-1.5 text-xs text-[#C8B560]">
                        <Calendar className="h-3.5 w-3.5" strokeWidth={1.6} />
                        <span>{activeDisplay.exam_date_label}</span>
                      </div>
                      <div className="mt-1 font-mono text-3xl font-semibold text-[#F0EDE6] tabular-nums">
                        {activeDisplay.readiness_pct}% pronto
                      </div>
                    </div>
                    <BookOpen className="h-5 w-5 text-[#5C5C5C]" strokeWidth={1.6} />
                  </div>

                  <div className="space-y-3 text-xs">
                    <div className="apple-subcard p-4">
                      <span className="block font-medium text-[#F0EDE6]/55">
                        O que ficou bom
                      </span>
                      <p className="mt-1 leading-relaxed text-[#F0EDE6]/90">
                        {activeDisplay.copilot_strength}
                      </p>
                    </div>

                    <div className="apple-subcard p-4 ring-1 ring-[#C8B560]/35">
                      <span className="block font-medium text-[#C8B560]">
                        O que faltou para a prova
                      </span>
                      <p className="mt-1 leading-relaxed text-[#F0EDE6]">
                        {activeDisplay.copilot_blindspot}
                      </p>
                    </div>

                    <div className="apple-subcard p-4">
                      <span className="block font-medium text-[#F0EDE6]/55">
                        Pergunta para testar agora
                      </span>
                      <p className="mt-1 leading-relaxed text-[#F0EDE6]/90">
                        {activeDisplay.copilot_question}
                      </p>
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() =>
                    onTestNoteInMutation(activeDisplay.note_content, activeDisplay.note_title)
                  }
                  className="group flex w-full items-center justify-between rounded-full bg-[#2A2A2A] py-2 pl-5 pr-2 text-xs font-semibold text-[#F0EDE6] transition hover:bg-[#F0EDE6] hover:text-[#0A0A0A]"
                >
                  <span>Testar esta nota em 60s</span>
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#0A0A0A]/25">
                    <ArrowUpRight className="h-4 w-4" strokeWidth={1.8} />
                  </span>
                </button>
              </>
            ) : (
              <div className="flex h-full flex-col items-center justify-center text-center text-xs text-[#F0EDE6]/55">
                <BookOpen className="mb-3 h-7 w-7 text-[#C8B560]" strokeWidth={1.5} />
                <p>
                  Escreva sua anotacao ao lado e clique em analisar para descobrir o que pode cair na prova e ainda nao esta claro.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
