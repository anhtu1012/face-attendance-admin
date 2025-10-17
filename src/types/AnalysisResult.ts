// Simplified AnalysisResult for faster CV analysis (3-5s target)
export interface AnalysisResult {
  matchScore: number;
  summary: string;
  strengths: string[];
  weaknesses: string[];
  recommendation:
    | "Strongly Recommend"
    | "Recommend"
    | "Consider"
    | "Not a good fit";
}
