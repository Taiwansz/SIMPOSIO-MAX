export interface NoteAnalysis {
  readinessPct: number;
  examDateLabel: string;
  strength: string;
  blindspot: string;
  question: string;
}

/**
 * Copiloto critico estilo ThSyr para anotacoes de aula:
 * Nao reescreve o resumo pelo estudante; aponta lacunas para a prova
 * e devolve uma pergunta direta para revisao ativa.
 */
export function analyzeStudentNote(params: {
  subjectName: string;
  noteTitle: string;
  noteContent: string;
  examDaysLeft: number;
}): NoteAnalysis {
  const { subjectName, noteTitle, noteContent, examDaysLeft } = params;
  const norm = noteContent
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();

  const lines = noteContent
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);
  const words = norm.split(/\s+/).filter(Boolean);

  const hasCause = ["porque", "pois", "logo", "entao", "quando", "se ", "por isso"].some(
    (w) => norm.includes(w)
  );
  const hasLimitOrFailure = [
    "erro", "falha", "nao", "limite", "trava", "risco", "perda", "caso", "exemplo", "<", ">", ">=",
  ].some((w) => norm.includes(w));

  let readinessPct = 28;
  readinessPct += Math.min(28, lines.length * 7);
  readinessPct += words.length >= 20 ? 14 : words.length >= 10 ? 7 : 0;
  if (hasCause) readinessPct += 14;
  if (hasLimitOrFailure) readinessPct += 14;
  if (examDaysLeft <= 3 && !hasLimitOrFailure) readinessPct -= 10;
  readinessPct = Math.max(15, Math.min(96, readinessPct));

  const examDateLabel =
    examDaysLeft === 0
      ? "Prova hoje"
      : examDaysLeft === 1
      ? "Prova amanha"
      : `Prova em ${examDaysLeft} dias`;

  const strength =
    hasCause && lines.length >= 2
      ? `Sua nota sobre "${noteTitle}" ligou a causa ao efeito em ${subjectName}.`
      : `Voce registrou os pontos iniciais de "${noteTitle}" em ${subjectName}.`;

  let blindspot = `A nota esta pronta para o teste de 60s; vale revisar um exemplo extremo antes da prova.`;
  let question = `Se uma regra de "${noteTitle}" mudar de repente na prova, o que quebra primeiro?`;

  if (words.length < 12) {
    blindspot = "Anotacao curta demais: faltam explicacoes de como o assunto funciona na pratica.";
    question = `Com suas palavras, o que acontece passo a passo em "${noteTitle}"?`;
  } else if (!hasCause) {
    blindspot = "Voce anotou o que e, mas nao anotou o porquê de funcionar assim.";
    question = `Por que essa regra de ${subjectName} funciona desse jeito e nao de outro?`;
  } else if (!hasLimitOrFailure) {
    blindspot = "Faltou registrar onde esse conceito da erro ou qual e o limite dele.";
    question = `Em qual situacao real "${noteTitle}" pode falhar mesmo parecendo certo?`;
  }

  return {
    readinessPct,
    examDateLabel,
    strength,
    blindspot,
    question,
  };
}
