export type BloomLevel =
  | "REMEMBER"
  | "UNDERSTAND"
  | "APPLY"
  | "ANALYZE"
  | "EVALUATE"
  | "CREATE";

export type MasteryStatus =
  | "UNSEEN"
  | "VULNERABLE"
  | "INCUBATING"
  | "CONSOLIDATED";

export interface EDAGNode {
  id: string;
  code: string;
  title: string;
  discipline: string;
  semester: number;
  bloom_level: BloomLevel;
  complexity: number;
  prerequisites: string[];
  description: string;
  fallacies: string[];
  keystone_score: number;
}

export interface StudentNodeState {
  id?: string;
  ra: string;
  student_name: string;
  node_id: string;
  p_mastery: number;
  p_transit: number;
  p_guess: number;
  p_slip: number;
  stability_hours: number;
  last_practiced_at: string;
  brier_score: number;
  confidence_claimed: number;
  attempts_count: number;
}

export interface SocraticLog {
  id: string;
  ra: string;
  node_id: string;
  student_argument: string;
  confidence_declared: number;
  causal_rigor_score: number;
  bluff_detected: boolean;
  bloom_reached: BloomLevel;
  inquisitor_response: string;
  counter_example: string;
  provider_used: string;
  created_at: string;
}

export interface IsomorphicChallengeParams {
  rate: number;
  latencyMs: number;
  frictionFactor: number;
  theoreticalCapacity: number;
  utilization: number;
  criticalNodesCount: number;
}

export interface IsomorphicChallenge {
  ra: string;
  topicId: string;
  topicTitle: string;
  examHash: string;
  seedNumeric: number;
  prompt: string;
  codePrompt: string;
  starterCode: string;
  parameters: IsomorphicChallengeParams;
  rubricRules: string[];
}

export interface IsomorphicSubmission {
  id: string;
  ra: string;
  exam_hash: string;
  topic_id: string;
  parameters_json: IsomorphicChallengeParams;
  submitted_code: string;
  submitted_numeric: number;
  ast_invariants_passed: boolean;
  analytical_score: number;
  verdict: string;
  diagnostics: string[];
  created_at: string;
}

export interface CohortWeekMetric {
  week_number: number;
  week_label: string;
  control_retention_pct: number;
  experimental_retention_pct: number;
  control_brier_score: number;
  experimental_brier_score: number;
  control_prereq_gap_pct: number;
  experimental_prereq_gap_pct: number;
  plagiarism_incidents_control: number;
  isomorphic_authenticity_pct: number;
}

export interface JuryFeedback {
  id: string;
  evaluator_name: string;
  evaluator_role: string;
  innovation_score: number;
  pedagogical_score: number;
  impact_score: number;
  comments: string;
  created_at: string;
}

export interface BKTUpdateResult {
  priorMastery: number;
  posteriorMastery: number;
  nextMastery: number;
  pGuess: number;
  pSlip: number;
  pTransit: number;
  newStabilityHours: number;
  status: MasteryStatus;
  dunningKrugerAlert: boolean;
  calibrationDelta: number;
}

export interface BrierCalibrationReport {
  brierScore: number;
  sampleSize: number;
  status: "CALIBRACAO_ALTA" | "CALIBRACAO_MODERADA" | "ALERTA_DUNNING_KRUGER" | "SEM_DADOS";
  meanOverconfidenceDelta: number;
  overconfidentCount: number;
  calibratedCount: number;
}

export interface EDAGCompileReport {
  isAcyclic: boolean;
  topologicalOrder: string[];
  cycleChains: string[][];
  criticalPath: string[];
  criticalPathWeight: number;
  bottlenecks: Array<{
    nodeId: string;
    code: string;
    title: string;
    downstreamCount: number;
    leverageRatio: number;
  }>;
  maxDepth: number;
  edgeCount: number;
}

export interface EpistemicRigorAnalysis {
  causalRigorScore: number;
  bluffDetected: boolean;
  isVerifiedCorrect: boolean;
  bloomReached: BloomLevel;
  matchedMechanisms: string[];
  detectedFluffPatterns: string[];
  agreedWithFallacy: boolean;
  reasoningCritique: string;
  inquisitorProbe: string;
  counterExample: string;
}

export interface FacultyDefenseEvaluation {
  agentTitle: string;
  subject: string;
  approved: boolean;
  score: number;
  critique: string;
  toolsUsed: string[];
}

export interface MultiRoundDefenseResult {
  projectTitle: string;
  verdict: string;
  approvalRatio: string;
  epistemicDelta: number;
  evaluations: FacultyDefenseEvaluation[];
  crossCuttingTensions: Array<{
    domains: string[];
    tension: string;
    critique: string;
  }>;
}
