/* eslint-disable @typescript-eslint/no-explicit-any */
import { AnalysisResult } from "@/types/AnalysisResult";
import { JobDetail } from "@/dtos/tac-vu-nhan-su/tuyen-dung/job/job-detail.dto";
import { GoogleGenAI, Type } from "@google/genai";
import { CvPromptSettings } from "@/types/CvPromptSettings";

// Do not construct the GoogleGenAI client at module load time. Next.js may
// bundle this file into client-side code which doesn't have access to
// server-only environment variables. Instead, lazily initialize the client
// inside the function that needs it and only when running on the server.
let ai: GoogleGenAI | null = null;
const model = "gemini-2.5-flash";

function ensureServerClient() {
  // In Next.js, process.browser is not reliable; instead check for
  // availability of process.env and window to detect server vs client.
  const isClient = typeof window !== "undefined";
  if (isClient) {
    throw new Error(
      "Gemini service is server-only and cannot be used in the browser"
    );
  }

  const key = process.env.GOOGLE_GENERATIVE_AI_API_KEY;
  if (!key) {
    throw new Error(
      "GOOGLE_GENERATIVE_AI_API_KEY environment variable not set"
    );
  }

  if (!ai) {
    ai = new GoogleGenAI({ apiKey: key });
  }

  return ai;
}

const analysisSchema = {
  type: Type.OBJECT,
  properties: {
    matchScore: {
      type: Type.INTEGER,
      description:
        "A percentage match score from 0 to 100 representing the candidate's compatibility with the job description.",
    },
    summary: {
      type: Type.STRING,
      description:
        "A concise, 2-3 sentences summary of the candidate's suitability for the role, including years of experience and key technical fit.",
    },
    strengths: {
      type: Type.ARRAY,
      items: {
        type: Type.STRING,
      },
      description:
        "Top 3-4 key strengths that align with job requirements. Be specific with evidence from CV.",
    },
    weaknesses: {
      type: Type.ARRAY,
      items: {
        type: Type.STRING,
      },
      description:
        "Top 2-3 critical weaknesses, missing skills, or concerns. Focus on deal-breakers only.",
    },
    recommendation: {
      type: Type.STRING,
      description:
        "A final hiring recommendation. Must be one of: 'Strongly Recommend', 'Recommend', 'Consider', 'Not a good fit'.",
    },
  },
  required: [
    "matchScore",
    "summary",
    "strengths",
    "weaknesses",
    "recommendation",
  ],
};

const buildJobDescriptionText = (jobDetail: JobDetail): string => {
  const parts: string[] = [];

  if (jobDetail.jobTitle) {
    parts.push(`Vị trí tuyển dụng: ${jobDetail.jobTitle}`);
  }

  if (jobDetail.jobDescription) {
    parts.push(`\nMô tả công việc:\n${jobDetail.jobDescription}`);
  }

  if (jobDetail.jobResponsibility) {
    parts.push(`\nTrách nhiệm công việc:\n${jobDetail.jobResponsibility}`);
  }

  if (jobDetail.jobOverview || jobDetail.requireExperience) {
    parts.push(`\nYêu cầu ứng viên:`);
    if (jobDetail.jobOverview) {
      parts.push(jobDetail.jobOverview);
    }
    if (jobDetail.requireExperience) {
      parts.push(`Kinh nghiệm: ${jobDetail.requireExperience}`);
    }
  }

  if (jobDetail.requireSkill && jobDetail.requireSkill.length > 0) {
    parts.push(`\nKỹ năng yêu cầu: ${jobDetail.requireSkill.join(", ")}`);
  }

  if (jobDetail.fromSalary || jobDetail.toSalary) {
    const salaryRange = [jobDetail.fromSalary, jobDetail.toSalary]
      .filter(Boolean)
      .join(" - ");
    if (salaryRange) {
      parts.push(`\nMức lương: ${salaryRange} VND`);
    }
  }

  if (jobDetail.jobBenefit) {
    parts.push(`\nQuyền lợi:\n${jobDetail.jobBenefit}`);
  }

  return parts.join("\n");
};

/**
 * Build dynamic prompt from settings
 * Optimized for speed by reducing token count and ensuring single language output
 */
const buildPromptFromSettings = (
  jobDetail: JobDetail,
  cvPromptSection: string,
  language: "en" | "vi",
  settings: CvPromptSettings
): string => {
  const jobDescriptionText = buildJobDescriptionText(jobDetail);
  const langConfig = settings.languages[language];
  const { matchScoreWeights, recommendationThresholds, analysisInstructions } =
    settings;

  // Build compact sections
  const matchScoreSection = `1. MatchScore (0-100):
   - Kỹ năng kỹ thuật: ${matchScoreWeights.technicalSkills}%
   - Kinh nghiệm: ${matchScoreWeights.experience}%
   - Seniority: ${matchScoreWeights.seniority}%`;

  const summarySection = `2. Summary (${
    analysisInstructions.summarySentencesCount
  } câu):
${analysisInstructions.summaryGuidelines.map((g) => `   - ${g}`).join("\n")}`;

  const strengthsSection = `3. Strengths (${
    analysisInstructions.maxStrengthsCount
  } điểm):
${analysisInstructions.strengthsGuidelines.map((g) => `   - ${g}`).join("\n")}`;

  const weaknessesSection = `4. Weaknesses (${
    analysisInstructions.maxWeaknessesCount
  } điểm):
${analysisInstructions.weaknessesGuidelines
  .map((g) => `   - ${g}`)
  .join("\n")}`;

  const recommendationSection = `5. Recommendation:
   - "${recommendationThresholds.stronglyRecommend.label}": ${recommendationThresholds.stronglyRecommend.min}-${recommendationThresholds.stronglyRecommend.max}%
   - "${recommendationThresholds.recommend.label}": ${recommendationThresholds.recommend.min}-${recommendationThresholds.recommend.max}%
   - "${recommendationThresholds.consider.label}": ${recommendationThresholds.consider.min}-${recommendationThresholds.consider.max}%
   - "${recommendationThresholds.notGoodFit.label}": ${recommendationThresholds.notGoodFit.min}-${recommendationThresholds.notGoodFit.max}%`;

  const rulesSection = analysisInstructions.generalRules
    .map((r) => `- ${r}`)
    .join("\n");

  // Construct compact prompt - single language only
  return `${langConfig.roleDescription}

**JOB:**
${jobDescriptionText}

${cvPromptSection}

**${langConfig.analysisTitle}:**

${matchScoreSection}

${summarySection}

${strengthsSection}

${weaknessesSection}

${recommendationSection}

**${langConfig.rulesTitle}:**
${rulesSection}`;
};

/**
 * Legacy prompt function - kept for backward compatibility
 * @deprecated Use buildPromptFromSettings with CvPromptSettings instead
 */
const getPrompt = (
  jobDetail: JobDetail,
  cvPromptSection: string,
  language: "en" | "vi"
): string => {
  const jobDescriptionText = buildJobDescriptionText(jobDetail);

  if (language === "vi") {
    return `Bạn là chuyên gia tuyển dụng kỹ thuật chuyên về công nghệ thông tin. Phân tích NHANH và CHÍNH XÁC CV này với yêu cầu công việc.

**CÔNG VIỆC:**
${jobDescriptionText}

${cvPromptSection}

**PHÂN TÍCH (TẬP TRUNG VÀO ĐIỂM CHÍNH):**

1. MatchScore (0-100): 
   - Kỹ năng kỹ thuật: 50%
   - Kinh nghiệm: 35%
   - Seniority: 15%

2. Summary (2-3 câu):
   - Số năm kinh nghiệm tổng + kinh nghiệm liên quan
   - Kỹ năng chính có/thiếu so với yêu cầu
   - Kết luận phù hợp hay không

3. Strengths (3-4 điểm):
   - Ưu tiên: Kỹ năng kỹ thuật chính, kinh nghiệm nổi bật, thành tích đo lường được
   - Ghi cụ thể: tên công nghệ, số năm, dự án thực tế

4. Weaknesses (2-3 điểm):
   - Chỉ liệt kê: Kỹ năng BẮT BUỘC thiếu, kinh nghiệm không đủ, red flag nghiêm trọng
   - Bỏ qua: Thiếu sót nhỏ, kỹ năng nice-to-have

5. Recommendation:
   - "Strongly Recommend": 85-100%, fit tốt
   - "Recommend": 70-84%, cần đào tạo nhẹ
   - "Consider": 50-69%, thiếu skills quan trọng
   - "Not a good fit": <50%, không đáp ứng

**QUY TẮC:**
- Dựa vào CHỨNG CỨ cụ thể từ CV, không đoán mò
- So sánh TRỰC TIẾP với từng yêu cầu công việc
- Đánh giá KHÁCH QUAN, tránh thiên vị
- TẬP TRUNG vào yêu cầu QUAN TRỌNG NHẤT
- NGẮN GỌN, SÚNG ĐẠN
- Không dài dòng, không mô tả chung chung`;
  }

  return `You are a technical recruiter. Analyze this CV QUICKLY and ACCURATELY against job requirements.

**JOB:**
${jobDescriptionText}

${cvPromptSection}

**ANALYSIS (FOCUS ON KEY POINTS):**

1. MatchScore (0-100):
   - Technical skills: 50%
   - Experience: 35%
   - Seniority: 15%

2. Summary (2-3 sentences):
   - Total years + relevant experience
   - Key skills present/missing vs requirements
   - Fit conclusion

3. Strengths (3-4 points):
   - Priority: Core technical skills, notable experience, measurable achievements
   - Be specific: tech names, years, actual projects

4. Weaknesses (2-3 points):
   - List only: Missing REQUIRED skills, insufficient experience, serious red flags
   - Skip: Minor gaps, nice-to-have skills

5. Recommendation:
   - "Strongly Recommend": 85-100%, good fit
   - "Recommend": 70-84%, needs light training
   - "Consider": 50-69%, missing important skills
   - "Not a good fit": <50%, doesn't meet requirements

**RULES:**
- Base on SPECIFIC EVIDENCE from CV, do not guess
- Compare DIRECTLY with each job requirement
- Be OBJECTIVE, avoid bias
- FOCUS on MOST IMPORTANT requirements
- BE CONCISE, BULLET-POINT
- No fluff, no generic descriptions`;
};

async function fileToGenerativePart(file: File) {
  const base64EncodedDataPromise = new Promise<string>((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve((reader.result as string).split(",")[1]);
    reader.readAsDataURL(file);
  });
  return {
    inlineData: { data: await base64EncodedDataPromise, mimeType: file.type },
  };
}

export type InlineDataPart = {
  inlineData: { data: string; mimeType: string };
};

/**
 * Analyze CV with optional custom prompt settings
 * Optimized for speed with temperature 0.1 and single language enforcement
 */
export async function analyzeCv(
  jobDetail: JobDetail,
  cvContent: string | File | InlineDataPart,
  language: "vi" | "en",
  customSettings?: CvPromptSettings
): Promise<AnalysisResult> {
  let contents: any;

  // Ensure we have a server-side client. This will throw with a clear error
  // if called from the browser or when the API key is not set.
  const client = ensureServerClient();

  // Determine which prompt builder to use
  const promptBuilder = customSettings
    ? (jd: JobDetail, cvSection: string, lang: "en" | "vi") =>
        buildPromptFromSettings(jd, cvSection, lang, customSettings)
    : getPrompt;

  if (typeof cvContent === "string") {
    const cvPromptSection = `**CV:**\n${cvContent}`;
    contents = promptBuilder(jobDetail, cvPromptSection, language);
  } else if (cvContent && (cvContent as InlineDataPart).inlineData) {
    // Already provided inline data (base64) from client
    const inline = (cvContent as InlineDataPart).inlineData;
    const cvPromptSection = `**CV is attached as file.**`;
    const prompt = promptBuilder(jobDetail, cvPromptSection, language);
    const textPart = { text: prompt };
    contents = { parts: [textPart, { inlineData: inline }] };
  } else {
    // Assume a File instance (server should not receive a browser File, but keep support)
    const imagePart = await fileToGenerativePart(cvContent as File);
    const cvPromptSection = `**CV is attached as image.**`;
    const prompt = promptBuilder(jobDetail, cvPromptSection, language);
    const textPart = { text: prompt };
    contents = { parts: [textPart, imagePart] };
  }

  try {
    const response = await client.models.generateContent({
      model: model,
      contents: contents,
      config: {
        responseMimeType: "application/json",
        responseSchema: analysisSchema,
        temperature: 0.1, // Lower temperature for faster, more consistent results
      },
    });

    if (!response.text) {
      throw new Error("No text received from Gemini API.");
    }
    const responseText = response.text.trim();
    const parsedResult: AnalysisResult = JSON.parse(responseText);

    // Validate required fields (simplified schema)
    if (
      typeof parsedResult.matchScore !== "number" ||
      !parsedResult.summary ||
      !Array.isArray(parsedResult.strengths) ||
      !Array.isArray(parsedResult.weaknesses) ||
      !parsedResult.recommendation
    ) {
      throw new Error(
        "Invalid JSON structure received from API: missing required fields"
      );
    }

    return parsedResult;
  } catch (error: unknown) {
    console.error("Error calling Gemini API:", error);
    const msg = error instanceof Error ? error.message : String(error);
    // Preserve original message to aid debugging while returning a safe error
    throw new Error("Failed to get analysis from Gemini API: " + msg);
  }
}
