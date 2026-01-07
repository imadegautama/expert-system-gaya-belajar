export interface QuestionOption {
  label: string;
  type: "V" | "A" | "K";
}
export interface Question {
  id: number;
  text: string;
  options: QuestionOption[];
  created_at: string;
}

export type AnswerType = "V" | "A" | "K";

export interface InferenceResult {
  rawScores: { V: number; A: number; K: number };
  percentages: { V: number; A: number; K: number };
  dominant: string;
  description: string;
}

export interface Result {
  id?: number;
  user_name: string;
  score_visual: number;
  score_auditory: number;
  score_kinesthetic: number;
  dominant_style: string;
  created_at?: string;
}

export interface SavedInferenceResult extends InferenceResult {
  id: number;
  userName: string;
}
