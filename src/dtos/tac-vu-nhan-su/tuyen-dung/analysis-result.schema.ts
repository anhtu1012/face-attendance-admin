import { z } from "zod";

export const AnalysisResultSchema = z.object({
  matchScore: z
    .number()
    .min(0)
    .max(100)
    .describe("Match score percentage between candidate and job requirements"),

  summary: z.string().min(1).describe("Overall summary of the analysis"),

  strengths: z.array(z.string()).min(1).describe("List of candidate strengths"),

  weaknesses: z
    .array(z.string())
    .min(1)
    .describe("List of candidate weaknesses"),

  recommendation: z
    .enum(["Strongly Recommend", "Recommend", "Consider", "Not a good fit"])
    .describe("Final recommendation based on analysis"),
});

export type AnalysisResult = z.infer<typeof AnalysisResultSchema>;

// Validation helper
export const validateAnalysisResult = (data: unknown): AnalysisResult => {
  return AnalysisResultSchema.parse(data);
};
