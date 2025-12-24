import { z } from "zod";

/**
 * Schema cho MatchScore Configuration
 */
export const MatchScoreWeightsSchema = z.object({
  technicalSkills: z.number().min(0).max(100).default(50),
  experience: z.number().min(0).max(100).default(35),
  seniority: z.number().min(0).max(100).default(15),
});

/**
 * Schema cho Recommendation Thresholds
 */
export const RecommendationThresholdsSchema = z.object({
  stronglyRecommend: z.object({
    min: z.number().min(0).max(100).default(85),
    max: z.number().min(0).max(100).default(100),
    label: z.string().default("Strongly Recommend"),
  }),
  recommend: z.object({
    min: z.number().min(0).max(100).default(70),
    max: z.number().min(0).max(100).default(84),
    label: z.string().default("Recommend"),
  }),
  consider: z.object({
    min: z.number().min(0).max(100).default(50),
    max: z.number().min(0).max(100).default(69),
    label: z.string().default("Consider"),
  }),
  notGoodFit: z.object({
    min: z.number().min(0).max(100).default(0),
    max: z.number().min(0).max(100).default(49),
    label: z.string().default("Not a good fit"),
  }),
});

/**
 * Schema cho Analysis Instructions
 */
export const AnalysisInstructionsSchema = z.object({
  summaryGuidelines: z
    .array(z.string())
    .default([
      "Số năm kinh nghiệm tổng + kinh nghiệm liên quan",
      "Kỹ năng chính có/thiếu so với yêu cầu",
      "Kết luận phù hợp hay không",
    ]),
  strengthsGuidelines: z
    .array(z.string())
    .default([
      "Ưu tiên: Kỹ năng kỹ thuật chính, kinh nghiệm nổi bật, thành tích đo lường được",
      "Ghi cụ thể: tên công nghệ, số năm, dự án thực tế",
    ]),
  weaknessesGuidelines: z
    .array(z.string())
    .default([
      "Chỉ liệt kê: Kỹ năng BẮT BUỘC thiếu, kinh nghiệm không đủ, red flag nghiêm trọng",
      "Bỏ qua: Thiếu sót nhỏ, kỹ năng nice-to-have",
    ]),
  generalRules: z
    .array(z.string())
    .default([
      "Dựa vào CHỨNG CỨ cụ thể từ CV, không đoán mò",
      "So sánh TRỰC TIẾP với từng yêu cầu công việc",
      "Đánh giá KHÁCH QUAN, tránh thiên vị",
      "TẬP TRUNG vào yêu cầu QUAN TRỌNG NHẤT",
      "NGẮN GỌN, SÚNG ĐẠN",
      "Không dài dòng, không mô tả chung chung",
    ]),
  maxStrengthsCount: z.number().min(1).max(10).default(4),
  maxWeaknessesCount: z.number().min(1).max(10).default(3),
  summarySentencesCount: z.number().min(1).max(5).default(3),
});

/**
 * Schema cho Language-specific Configuration
 */
export const LanguageConfigSchema = z.object({
  roleDescription: z.string(),
  analysisTitle: z.string(),
  rulesTitle: z.string(),
});

/**
 * Main CV Prompt Settings Schema
 */
export const CvPromptSettingsSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, "Tên cấu hình là bắt buộc"),
  description: z.string().optional(),
  isActive: z.boolean().default(true),
  isDefault: z.boolean().default(false),

  // Language configurations
  languages: z.object({
    vi: LanguageConfigSchema,
    en: LanguageConfigSchema,
  }),

  // Match score weights
  matchScoreWeight: MatchScoreWeightsSchema,

  // Recommendation thresholds
  recommendationThresholds: RecommendationThresholdsSchema,

  // Analysis instructions
  analysisInstruction: AnalysisInstructionsSchema,

  // Metadata
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
  createdBy: z.string().optional(),
  updatedBy: z.string().optional(),
});

export type MatchScoreWeights = z.infer<typeof MatchScoreWeightsSchema>;
export type RecommendationThresholds = z.infer<
  typeof RecommendationThresholdsSchema
>;
export type AnalysisInstructions = z.infer<typeof AnalysisInstructionsSchema>;
export type LanguageConfig = z.infer<typeof LanguageConfigSchema>;
export type CvPromptSettings = z.infer<typeof CvPromptSettingsSchema>;

// Re-export for use in DTOs
export type CreateCvPromptSettingsRequest = Omit<
  CvPromptSettings,
  "id" | "createdAt" | "updatedAt" | "createdBy" | "updatedBy"
>;

export type UpdateCvPromptSettingsRequest = Partial<
  Omit<CvPromptSettings, "createdAt" | "updatedAt" | "createdBy" | "updatedBy">
>;

/**
 * Default CV Prompt Settings for Vietnamese
 */
export const DEFAULT_CV_PROMPT_SETTINGS_VI: CvPromptSettings = {
  name: "Default Vietnamese Configuration",
  description: "Cấu hình mặc định cho phân tích CV bằng tiếng Việt",
  isActive: true,
  isDefault: true,
  languages: {
    vi: {
      roleDescription:
        "Bạn là chuyên gia tuyển dụng kỹ thuật chuyên về công nghệ thông tin. Phân tích NHANH và CHÍNH XÁC CV này với yêu cầu công việc.",
      analysisTitle: "PHÂN TÍCH (TẬP TRUNG VÀO ĐIỂM CHÍNH)",
      rulesTitle: "QUY TẮC",
    },
    en: {
      roleDescription:
        "You are a technical recruiter specializing in information technology. Analyze this CV QUICKLY and ACCURATELY against job requirements.",
      analysisTitle: "ANALYSIS (FOCUS ON KEY POINTS)",
      rulesTitle: "RULES",
    },
  },
  matchScoreWeight: {
    technicalSkills: 50,
    experience: 35,
    seniority: 15,
  },
  recommendationThresholds: {
    stronglyRecommend: {
      min: 85,
      max: 100,
      label: "Strongly Recommend",
    },
    recommend: {
      min: 70,
      max: 84,
      label: "Recommend",
    },
    consider: {
      min: 50,
      max: 69,
      label: "Consider",
    },
    notGoodFit: {
      min: 0,
      max: 49,
      label: "Not a good fit",
    },
  },
  analysisInstruction: {
    summaryGuidelines: [
      "Số năm kinh nghiệm tổng + kinh nghiệm liên quan",
      "Kỹ năng chính có/thiếu so với yêu cầu",
      "Kết luận phù hợp hay không",
    ],
    strengthsGuidelines: [
      "Ưu tiên: Kỹ năng kỹ thuật chính, kinh nghiệm nổi bật, thành tích đo lường được",
      "Ghi cụ thể: tên công nghệ, số năm, dự án thực tế",
    ],
    weaknessesGuidelines: [
      "Chỉ liệt kê: Kỹ năng BẮT BUỘC thiếu, kinh nghiệm không đủ, red flag nghiêm trọng",
      "Bỏ qua: Thiếu sót nhỏ, kỹ năng nice-to-have",
    ],
    generalRules: [
      "Dựa vào CHỨNG CỨ cụ thể từ CV, không đoán mò",
      "So sánh TRỰC TIẾP với từng yêu cầu công việc",
      "Đánh giá KHÁCH QUAN, tránh thiên vị",
      "TẬP TRUNG vào yêu cầu QUAN TRỌNG NHẤT",
      "NGẮN GỌN, SÚNG ĐẠN",
      "Không dài dòng, không mô tả chung chung",
    ],
    maxStrengthsCount: 4,
    maxWeaknessesCount: 3,
    summarySentencesCount: 3,
  },
};
