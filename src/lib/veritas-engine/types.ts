export type VeritasArea = "Computacao" | "Saude" | "Negocios";

export interface FixOption {
  id: string;
  label: string;
}

export interface AutopsyCase {
  id: string;
  area: VeritasArea;
  title: string;
  summary: string;
  ai_output_lines: string[];
  fault_line_index: number;
  trigger_param_name: string;
  trigger_param_unit: string;
  trigger_min: number;
  trigger_max: number;
  trigger_break_threshold: number;
  safe_fix_options: FixOption[];
  correct_fix_id: string;
  explanation_simple: string;
}

export interface AutopsyLog {
  id: string;
  student_name: string;
  ra: string;
  case_id: string;
  selected_line: number;
  selected_fix_id: string;
  solved: boolean;
  created_at: string;
}

export interface MutationChallenge {
  challengeId: string;
  artifactTitle: string;
  area: VeritasArea;
  originalLines: string[];
  mutatedLines: string[];
  mutatedLineIndex: number;
  mutationHint: string;
  fixOptions: FixOption[];
  correctFixId: string;
}

export interface AuthorshipProof {
  id: string;
  student_name: string;
  ra: string;
  artifact_title: string;
  mutated_line: number;
  elapsed_seconds: number;
  passed: boolean;
  proof_hash: string;
  created_at: string;
}

export interface ArenaResponse {
  id: string;
  session_code: string;
  participant_name: string;
  role: string;
  response_text: string;
  coord_x: number;
  coord_y: number;
  uniqueness_score: number;
  created_at: string;
}

export interface ArenaAnalysis {
  originalityIndex: number;
  herdCollapseDetected: boolean;
  repeatedClusterCount: number;
  debatePair: [ArenaResponse, ArenaResponse] | null;
  blackSwanPrompt: string;
}

export interface CohortResultWeek {
  week_number: number;
  week_label: string;
  control_autonomy_pct: number;
  veritas_autonomy_pct: number;
  herd_collapse_pct: number;
  veritas_originality_pct: number;
}

export interface JuryVote {
  id: string;
  evaluator_name: string;
  innovation_score: number;
  pedagogical_score: number;
  impact_score: number;
  note: string;
  created_at: string;
}
