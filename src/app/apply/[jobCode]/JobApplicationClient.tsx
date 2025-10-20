/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import {
  getStatusColor,
  getStatusText,
} from "@/app/(view)/tac-vu-nhan-su/tuyen-dung/_utils/status";
import { trackEvent, trackUrlVisit } from "@/components/GoogleAnalytics";
import LayoutContent from "@/components/LayoutContentForder/layoutContent";
import { JobDetail } from "@/dtos/tac-vu-nhan-su/tuyen-dung/job/job-detail.dto";
import { useAntdMessage } from "@/hooks/AntdMessageProvider";
import { useSelectData } from "@/hooks/useSelectData";
// JobServices import removed (not used in this component)
import ApplyServices from "@/services/apply/apply.service";
import JobServices from "@/services/tac-vu-nhan-su/tuyen-dung/job/job.service";
import { AnalysisResult } from "@/types/AnalysisResult";
import { extractFile } from "@/utils/extractFile";
import {
  Badge,
  Button,
  Card,
  Checkbox,
  DatePicker,
  Divider,
  Form,
  Input,
  Select,
  Upload,
  UploadFile,
} from "antd";
import dayjs from "dayjs";
import { useParams } from "next/navigation";
import React, { useCallback, useEffect, useState } from "react";
import {
  FaBriefcase,
  FaBuilding,
  FaCalendarAlt,
  FaCheck,
  FaClock,
  FaCloudUploadAlt,
  FaEnvelope,
  FaEye,
  FaFileAlt,
  FaMapMarkerAlt,
  FaMoneyBillWave,
  FaPhone,
  FaStar,
  FaUser,
  FaUsers,
} from "react-icons/fa";
import { MdEmail, MdPhone } from "react-icons/md";
import AIAnalysisLoadingModal from "./_components/AIAnalysisLoadingModal/AIAnalysisLoadingModal";
import AIAnalysisResultModal from "./_components/AIAnalysisResultModal/AIAnalysisResultModal";
import "./JobApplicationPage.scss";
const COOKIE_TTL_SECONDS = 24 * 60 * 60;
interface JobApplicationFormData {
  fullName: string;
  email: string;
  phone: string;
  birthday: string;
  address: string;
  fileCV: File | null; // CV file
  gender: string;
  experience: string; // Số năm kinh nghiệm
  skillIds: string[]; // Kỹ năng
  jobApplicationFormId?: string; // Job ID
}

type JobApplicationClientProps = {
  initialViews?: number;
  initialViewed?: boolean; // if true, server already counted and client should not call API
};

const JobApplicationClient: React.FC<JobApplicationClientProps> = ({
  initialViews,
  initialViewed,
}) => {
  const params = useParams();
  const jobCode = params.jobCode as string;
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const messageApi = useAntdMessage();
  const [jobDetail, setJobDetail] = useState<JobDetail | null>(null);
  const [jobLoading, setJobLoading] = useState(true);
  const [isFormValid, setIsFormValid] = useState(false);
  const { selectGender } = useSelectData({
    fetchSkill: false,
  });
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(
    null
  );
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showAnalysisModal, setShowAnalysisModal] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);
  const companyInfo = {
    companyName: "FaceAI Technology Solutions",
    workingHours: "8:00 - 17:30 (T2-T6)",
    companyAddress: "123 Đường ABC, Quận 1, TP.HCM",
    location: "123 Đường ABC, Quận 1, TP.HCM",
    companyEmail: "company12@gmail.com",
    companyPhone: "0123 456 789",
  };
  useEffect(() => {
    if (!jobCode) return;

    const load = async (id: string) => {
      setJobLoading(true);
      try {
        const res = await JobServices.getDetailJob(jobCode);

        if (typeof initialViews === "number") {
          res.statistics.views = initialViews;
        }

        setJobDetail(res);

        // Track URL visit for this specific job application page
        trackUrlVisit(`/apply/${id}`, {
          page_type: "job_application",
          job_id: id,
          timestamp: new Date().toISOString(),
        });

        // Track event for job page view
        trackEvent("job_page_view", "job_application", `job_${id}`);

        // Client-side deduped increment handled separately (server SSR increment may also have run).
        const cookieName = `job_viewed_${id}`;
        try {
          if (initialViewed) {
            // Server already incremented: set session cookie so client does not call API again.
            if (typeof document !== "undefined") {
              try {
                // Set a persistent cookie that expires after COOKIE_TTL_SECONDS (24h)
                document.cookie = `${cookieName}=1; path=/; Max-Age=${COOKIE_TTL_SECONDS}`;
              } catch {
                /* ignore cookie set errors */
              }
            }
          } else {
            const hasViewed =
              typeof document !== "undefined" &&
              document.cookie
                .split("; ")
                .some((c) => c.startsWith(cookieName + "="));
            if (!hasViewed) {
              // Use Upstash service wrapper which uses axios and sends cookies by default
              try {
                const resp = await fetch("/api/views", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  credentials: "include",
                  body: JSON.stringify({ jobCode: id }),
                });

                if (resp.status === 501) {
                  // Server indicates Upstash not configured; log and continue without failing UX
                  console.warn("Upstash not configured on server (501)");
                } else if (!resp.ok) {
                  // Non-OK (including 404) — surface for debugging but don't break UX
                  console.error(
                    "Error incrementing views:",
                    resp.status,
                    await resp.text()
                  );
                } else {
                  const data = await resp.json();
                  console.log("Increment views response:", data);
                  if (data && typeof data.views === "number") {
                    setJobDetail((prev) =>
                      prev
                        ? {
                            ...prev,
                            statistics: {
                              ...prev.statistics,
                              views: data.views,
                            },
                          }
                        : prev
                    );
                  }
                }
              } catch (err) {
                // ignore errors from incrementing views but log for visibility
                console.error("Error incrementing views:", err);
              }

              if (typeof document !== "undefined") {
                try {
                  // Set a persistent cookie that expires after COOKIE_TTL_SECONDS (24h)
                  document.cookie = `${cookieName}=1; path=/; Max-Age=${COOKIE_TTL_SECONDS}`;
                } catch {
                  /* ignore cookie set errors */
                }
              }
            }
          }
        } catch {
          /* ignore client view increment errors */
        }
      } catch (error) {
        console.error("Error fetching job detail:", error);
        messageApi.error("Không thể tải thông tin công việc!");
      } finally {
        setJobLoading(false);
      }
    };

    load(jobCode);
  }, [jobCode, initialViewed, initialViews, messageApi]);

  // Helper function to convert File to base64
  const fileToBase64 = useCallback((file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve((reader.result as string).split(",")[1]);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }, []);

  // Helper function to perform CV analysis
  const performCvAnalysis = useCallback(
    async (file: File, showModalOnComplete: boolean, formData: any) => {
      if (!jobDetail) return;

      if (showModalOnComplete) {
        setIsAnalyzing(true);
        setLoadingStep(0);
      }

      const stepInterval = showModalOnComplete
        ? setInterval(() => {
            setLoadingStep((prev) => (prev < 3 ? prev + 1 : prev));
          }, 1000)
        : null;

      try {
        const payload: any = { jobDetail, language: "vi" };

        // Convert file to base64 and add to payload
        const base64 = await fileToBase64(file);
        payload.inlineData = { data: base64, mimeType: file.type };

        const resp = await fetch("/api/analyze-cv", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        if (!resp.ok) {
          const err = await resp.json().catch(() => ({}));
          throw new Error(err?.error || "Analysis API failed");
        }

        const json = await resp.json();
        const { result, cached, duration } = json;

        console.log("KẾT QUẢ PHÂN TÍCH:", result);
        console.log(`Cached: ${cached}, Duration: ${duration}ms`);

        // attach analysis result into the same formData so server gets both files and analysis
        try {
          const analysisPayload = {
            analysisResult: result,
            matchScore: result?.matchScore ?? null,
            recommendation: result?.recommendation ?? null,
          };

          // formData may be a FormData instance or plain object; handle both
          // Append analysis fields individually so server receives typed fields
          const appendAnalysisToFormData = (fd: FormData, payload: any) => {
            // matchScore (nullable number)
            if (
              payload.matchScore !== undefined &&
              payload.matchScore !== null
            ) {
              fd.append("matchScore", String(payload.matchScore));
            }

            // summary (string)
            if (payload.analysisResult && payload.analysisResult.summary) {
              fd.append("summary", String(payload.analysisResult.summary));
            }

            // strengths (array of strings) -> append each item as 'strengths'
            const strengths = payload.analysisResult?.strengths;
            if (Array.isArray(strengths)) {
              strengths.forEach((s: any) => fd.append("strengths", String(s)));
            }

            // weaknesses (array of strings) -> append each item as 'weaknesses'
            const weaknesses = payload.analysisResult?.weaknesses;
            if (Array.isArray(weaknesses)) {
              weaknesses.forEach((w: any) =>
                fd.append("weaknesses", String(w))
              );
            }

            // recommendation (enum string)
            if (payload.recommendation) {
              fd.append("recommendation", String(payload.recommendation));
            }
          };

          if (formData instanceof FormData) {
            appendAnalysisToFormData(formData, analysisPayload);
          } else if (formData && typeof formData === "object") {
            // try to convert plain object to FormData
            const fd = new FormData();
            Object.entries(formData).forEach(([k, v]) =>
              fd.append(k, v as any)
            );
            appendAnalysisToFormData(fd, analysisPayload);
            formData = fd;
          }

          // Always attempt to submit the combined form data so server records application + analysis
          // For foreground (showModalOnComplete) we await submission so we can inform the user.
          if (showModalOnComplete) {
            if (stepInterval) clearInterval(stepInterval);
            setLoadingStep(3);

            const submitResp = await ApplyServices.createRecruitmentMultipart(
              formData
            );
            // Track application events
            trackEvent(
              "application_start",
              "job_application",
              `job_${jobCode}`
            );
            trackEvent(
              "application_success",
              "job_application",
              `job_${jobCode}`
            );

            setAnalysisResult(result);
            setShowAnalysisModal(true);

            // Show success message
            const message = cached
              ? "Phân tích CV thành công! (Kết quả từ cache)"
              : duration
              ? `Phân tích CV thành công! (${(duration / 1000).toFixed(1)}s)`
              : "Phân tích CV thành công!";

            messageApi.success({ content: message, duration: 3 });

            // Optionally handle response (submitResp) if needed
            console.log("Application submission response:", submitResp);
          } else {
            // Background analysis: submit but don't block UI
            ApplyServices.createRecruitmentMultipart(formData)
              .then((resp) =>
                console.log("Background application submitted:", resp)
              )
              .catch((err) => console.error("Background submit failed:", err));

            console.log("Phân tích CV hoàn tất ở chế độ nền");
          }
        } catch (e2) {
          console.error("Error appending/submitting analysis result:", e2);
        }
      } catch (e) {
        console.error("Lỗi khi phân tích CV:", e);
        if (showModalOnComplete) {
          messageApi.error("Không thể phân tích CV. Vui lòng thử lại!");
        }
      } finally {
        if (stepInterval) clearInterval(stepInterval);
        if (showModalOnComplete) {
          setIsAnalyzing(false);
          setLoadingStep(0);
        }
      }
    },
    [jobDetail, fileToBase64, jobCode, messageApi]
  );

  const handleSubmitApplication = async (values: JobApplicationFormData) => {
    setLoading(true);
    try {
      if (values.birthday) {
        values.birthday = dayjs(values.birthday).toISOString();
      }
      values.jobApplicationFormId = jobDetail?.id;
      // Build multipart/form-data
      const formData = new FormData();
      const file = extractFile(values.fileCV);
      if (file) {
        formData.append("fileCV", file, file.name);
      }
      Object.entries(values).forEach(([key, value]) => {
        if (key === "fileCV") return;
        if (value === undefined || value === null) return;

        // For other arrays, append each item separately
        if (Array.isArray(value)) {
          value.forEach((v) => formData.append(key, String(v)));
        } else {
          formData.append(key, String(value));
        }
      });
      // Check if email and phone exist
      await ApplyServices.checkMailAndPhoneExist(values.email, values.phone);

      // Determine whether user wanted immediate AI result from the form field
      const wantsAiResult = form.getFieldValue("receiveAiResult") ?? true;

      // Perform CV analysis based on checkbox state
      if (file) {
        if (wantsAiResult) {
          // User wants immediate AI result - show loading modal and result
          await performCvAnalysis(file, true, formData);
        } else {
          // User doesn't want immediate result - save to deferred queue for processing at midnight
          try {
            const deferredResp = await fetch("/api/deferred-apply", {
              method: "POST",
              body: formData,
            });

            if (!deferredResp.ok) {
              const errorData = await deferredResp.json().catch(() => ({}));
              throw new Error(
                errorData.error || "Failed to submit application"
              );
            }

            const deferredData = await deferredResp.json();
            console.log(
              "Application saved to deferred queue:",
              deferredData.id
            );

            messageApi.success({
              content:
                deferredData.message ||
                "Cảm ơn bạn đã ứng tuyển! Chúng tôi sẽ xem xét và liên hệ với bạn sớm.",
              duration: 5,
            });

            // Track deferred submission
            trackEvent(
              "application_deferred",
              "job_application",
              `job_${jobCode}`
            );
          } catch (deferredError) {
            console.error("Deferred submission failed:", deferredError);
            throw deferredError; // Will be caught by outer catch
          }
        }
      } else {
        // No file, just show success
        messageApi.success(
          "Ứng tuyển thành công! Chúng tôi sẽ liên hệ với bạn sớm."
        );
      }

      form.resetFields();
      setIsFormValid(false);
    } catch (error: any) {
      console.error("Error submitting application:", error);
      trackEvent("application_error", "job_application", `job_${jobCode}`);
      messageApi.error(error.response?.data?.message || "Ứng tuyển thất bại!");
    } finally {
      setLoading(false);
    }
  };

  // Check whether required fields are filled and have no validation errors.
  const checkFormValid = useCallback(() => {
    const allFields = [
      "fullName",
      "email",
      "phone",
      "birthday",
      "gender",
      "fileCV",
    ];

    const values = form.getFieldsValue(allFields);

    // If any required value is missing/empty -> invalid
    for (const key of allFields) {
      const val = values[key];
      if (val === undefined || val === null) {
        setIsFormValid(false);
        return;
      }
      if (Array.isArray(val) && val.length === 0) {
        setIsFormValid(false);
        return;
      }
      if (typeof val === "string" && val.trim() === "") {
        setIsFormValid(false);
        return;
      }
    }

    // Ensure there are no validation errors reported by the form for required fields
    const errors = form.getFieldsError(allFields);
    if (errors.some((e) => e.errors && e.errors.length > 0)) {
      setIsFormValid(false);
      return;
    }

    setIsFormValid(true);
  }, [form]);

  // Initialize validity on mount and whenever the check function changes
  useEffect(() => {
    checkFormValid();
  }, [checkFormValid]);

  const uploadProps = {
    name: "file",
    accept: ".pdf,.doc,.docx",
    showUploadList: {
      showPreviewIcon: true,
      showDownloadIcon: true,
      showRemoveIcon: true,
    },
    beforeUpload: (file: File) => {
      const isValidFormat =
        file.type === "application/pdf" ||
        file.type === "application/msword" ||
        file.type ===
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
      if (!isValidFormat) {
        messageApi.error("Chỉ hỗ trợ file PDF, DOC, DOCX!");
        return false;
      }
      const isValidSize = file.size / 1024 / 1024 < 5;
      if (!isValidSize) {
        messageApi.error("File không được vượt quá 5MB!");
        return false;
      }
      return false; // Prevent auto upload
    },
    onPreview: (file: UploadFile) => {
      // Handle preview for PDF files
      if (file.type === "application/pdf" && file.originFileObj) {
        const url = URL.createObjectURL(file.originFileObj);
        window.open(url, "_blank");
      } else {
        messageApi.info("Preview chỉ khả dụng cho file PDF");
      }
    },
  };

  if (jobLoading) {
    return (
      <div className="job-application-page">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Đang tải thông tin công việc...</p>
        </div>
      </div>
    );
  }

  if (!jobDetail) {
    return (
      <div className="job-application-page">
        <div className="error-container">
          <h2>Không tìm thấy công việc</h2>
          <p>
            {" "}
            Công việc có ID &quot;{jobCode}&quot; không tồn tại hoặc đã bị xóa.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="job-application-page">
      {/* Company Header */}
      <div className="company-header">
        <div className="company-header-content">
          <div className="company-info">
            <div className="company-logo">
              <FaBuilding size={50} className="company-icon" />
            </div>
            <div className="company-name">
              <h1>{companyInfo.companyName}</h1>
            </div>
          </div>
          <div className="company-contact">
            <div className="contact-top">
              <div className="contact-item">
                <FaPhone className="contact-icon" />
                <span>{companyInfo.companyPhone}</span>
              </div>
              <div className="contact-item">
                <FaEnvelope className="contact-icon" />
                <span>{companyInfo.companyEmail}</span>
              </div>
            </div>
            <div className="contact-bottom">
              <div className="contact-item">
                <FaMapMarkerAlt className="contact-icon" />
                <span>{companyInfo.companyAddress}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="application-content">
        <LayoutContent
          layoutType={5}
          option={{
            floatButton: true,
            sizeAdjust: [5, 5],
          }}
          content1={
            <div className="application-form-section">
              <Card className="application-form-card">
                <div className="form-header">
                  <h2>
                    <FaUser /> Thông tin ứng viên
                  </h2>
                  <p>
                    Vui lòng điền đầy đủ thông tin để ứng tuyển vào vị trí này
                  </p>
                </div>

                <Form
                  form={form}
                  layout="vertical"
                  onFinish={handleSubmitApplication}
                  className="application-form"
                  requiredMark="optional"
                  initialValues={{ receiveAiResult: true }}
                  onFieldsChange={() => {
                    // non-intrusive validity check when user changes fields
                    checkFormValid();
                  }}
                >
                  <div className="form-row">
                    <div className="form-col-12">
                      <Form.Item
                        name="fullName"
                        label="Họ và tên"
                        rules={[
                          {
                            required: true,
                            message: "Vui lòng nhập họ và tên!",
                          },
                          {
                            min: 2,
                            message: "Họ tên phải có ít nhất 2 ký tự!",
                          },
                        ]}
                      >
                        <Input
                          prefix={<FaUser />}
                          placeholder="VD: Nguyễn Văn An"
                          className="custom-input"
                          size="large"
                        />
                      </Form.Item>
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-col-6">
                      <Form.Item
                        name="email"
                        label="Email"
                        rules={[
                          {
                            required: true,
                            message: "Vui lòng nhập email!",
                          },
                          {
                            type: "email",
                            message: "Email không hợp lệ!",
                          },
                        ]}
                      >
                        <Input
                          prefix={<FaEnvelope />}
                          placeholder="example@gmail.com"
                          className="custom-input"
                          size="large"
                        />
                      </Form.Item>
                    </div>
                    <div className="form-col-6">
                      <Form.Item
                        name="phone"
                        label="Số điện thoại"
                        rules={[
                          {
                            required: true,
                            message: "Vui lòng nhập số điện thoại!",
                          },
                          {
                            pattern: /^[0-9+\-\s()]+$/,
                            message: "Số điện thoại không hợp lệ!",
                          },
                        ]}
                      >
                        <Input
                          prefix={<FaPhone />}
                          placeholder="0912345678"
                          className="custom-input"
                          size="large"
                          maxLength={10}
                        />
                      </Form.Item>
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-col-6">
                      <Form.Item
                        name="birthday"
                        label="Ngày sinh"
                        validateTrigger={["onChange", "onBlur"]}
                        rules={[
                          {
                            required: true,
                            message: "Vui lòng chọn ngày sinh!",
                          },
                          {
                            validator: (_: unknown, value: unknown) => {
                              if (!value) return Promise.resolve();

                              let selectedDate: Date;
                              const v = value as unknown;
                              if (
                                v &&
                                typeof (v as { toDate?: () => Date }).toDate ===
                                  "function"
                              ) {
                                selectedDate = (
                                  v as { toDate: () => Date }
                                ).toDate();
                              } else if (v instanceof Date) {
                                selectedDate = v as Date;
                              } else {
                                selectedDate = new Date(String(v));
                              }

                              const today = new Date();
                              let age =
                                today.getFullYear() -
                                selectedDate.getFullYear();
                              const m =
                                today.getMonth() - selectedDate.getMonth();
                              if (
                                m < 0 ||
                                (m === 0 &&
                                  today.getDate() < selectedDate.getDate())
                              ) {
                                age--;
                              }

                              if (age < 18) {
                                return Promise.reject(
                                  new Error("Bạn chưa đủ 18 tuổi!")
                                );
                              }

                              return Promise.resolve();
                            },
                          },
                        ]}
                      >
                        <DatePicker
                          placeholder="Chọn ngày sinh"
                          className="custom-datepicker"
                          style={{ width: "100%" }}
                          size="large"
                          format="DD/MM/YYYY"
                        />
                      </Form.Item>
                    </div>
                    <div className="form-col-6">
                      <Form.Item
                        name="gender"
                        label="Giới tính"
                        rules={[
                          {
                            required: true,
                            message: "Vui lòng chọn giới tính!",
                          },
                        ]}
                      >
                        <Select
                          placeholder="Chọn giới tính"
                          options={selectGender}
                          className="custom-select"
                          size="large"
                        />
                      </Form.Item>
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-col-12">
                      <Form.Item
                        name="fileCV"
                        // label="Upload CV"
                        rules={[
                          {
                            required: true,
                            message: "Vui lòng upload CV!",
                          },
                        ]}
                        valuePropName="fileList"
                        getValueFromEvent={(e: any) => {
                          if (Array.isArray(e)) return e;
                          return e && e.fileList ? e.fileList : undefined;
                        }}
                      >
                        <Upload.Dragger {...uploadProps} className="cv-upload">
                          <div className="upload-content">
                            <FaCloudUploadAlt className="upload-icon" />
                            <p className="upload-text">
                              Kéo thả file CV vào đây hoặc{" "}
                              <span>click để chọn file</span>
                            </p>
                            {/* <p className="upload-hint">
                              Hỗ trợ: PDF, DOC, DOCX (tối đa 5MB)
                            </p> */}
                          </div>
                        </Upload.Dragger>
                      </Form.Item>
                    </div>
                  </div>

                  <div className="ai-analysis-option">
                    <Form.Item
                      name="receiveAiResult"
                      valuePropName="checked"
                      style={{ marginBottom: "1rem" }}
                    >
                      <Checkbox className="ai-checkbox-wrapper">
                        <div className="ai-checkbox-text">
                          <span className="ai-checkbox-title">
                            Nhận kết quả phân tích AI
                          </span>
                        </div>
                      </Checkbox>
                    </Form.Item>
                  </div>

                  <div className="form-actions">
                    <Button
                      type="primary"
                      htmlType="submit"
                      loading={loading}
                      disabled={!isFormValid || loading}
                      className="submit-btn"
                      size="large"
                      icon={<FaCheck />}
                      block
                    >
                      {loading
                        ? "Đang gửi ứng tuyển..."
                        : "Gửi hồ sơ ứng tuyển"}
                    </Button>
                  </div>
                </Form>
              </Card>
            </div>
          }
          content2={
            <div className="job-details-section">
              <Card className="job-details-card">
                {/* Job Header */}
                <div className="job-header">
                  <div className="job-title-section">
                    <h1 className="job-title">{jobDetail.jobTitle}</h1>
                    <div className="job-meta">
                      <Badge
                        color={getStatusColor(jobDetail.status)}
                        text={getStatusText(jobDetail.status)}
                        className="status-badge"
                      />
                      <span className="company-name">
                        <FaBuilding /> {companyInfo.companyName}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Quick Info */}
                <div className="job-quick-info">
                  <div className="info-grid">
                    <div className="info-item">
                      <FaMapMarkerAlt className="info-icon" />
                      <div className="info-text">
                        <span className="info-label">Địa điểm</span>
                        <span className="info-value">{jobDetail.address}</span>
                      </div>
                    </div>

                    <div className="info-item">
                      <FaMoneyBillWave className="info-icon" />
                      <div className="info-text">
                        <span className="info-label">Mức lương</span>
                        <span className="info-value">
                          {jobDetail.fromSalary}-{jobDetail.toSalary} triệu VNĐ
                        </span>
                      </div>
                    </div>

                    <div className="info-item">
                      <FaClock className="info-icon" />
                      <div className="info-text">
                        <span className="info-label">Kinh nghiệm</span>
                        <span className="info-value">
                          {jobDetail.requireExperience} năm
                        </span>
                      </div>
                    </div>

                    <div className="info-item">
                      <FaCalendarAlt className="info-icon" />
                      <div className="info-text">
                        <span className="info-label">Hạn nộp</span>
                        <span className="info-value">
                          {dayjs(jobDetail.expirationDate).format("DD/MM/YYYY")}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <Divider />

                {/* Job Description */}
                <div className="job-description">
                  <h3>
                    <FaBriefcase /> Mô tả công việc
                  </h3>
                  <div
                    className="content"
                    dangerouslySetInnerHTML={{
                      __html: jobDetail.jobDescription ?? "",
                    }}
                  />
                </div>

                <div className="job-responsibilities">
                  <h3>
                    <FaStar /> Trách nhiệm công việc
                  </h3>
                  <div
                    className="content"
                    dangerouslySetInnerHTML={{
                      __html: jobDetail.jobResponsibility ?? "",
                    }}
                  />
                </div>

                <div className="job-requirements">
                  <h3>
                    <FaFileAlt /> Yêu cầu ứng viên
                  </h3>
                  <div
                    className="content"
                    dangerouslySetInnerHTML={{
                      __html: jobDetail.jobOverview ?? "",
                    }}
                  />
                </div>

                <div className="job-benefits">
                  <h3>
                    <FaCheck /> Quyền lợi
                  </h3>
                  <div
                    className="content"
                    dangerouslySetInnerHTML={{
                      __html: jobDetail.jobBenefit ?? "",
                    }}
                  />
                </div>

                <Divider />

                {/* Statistics */}
                <div className="job-statistics">
                  <h3>
                    <FaEye /> Thống kê
                  </h3>
                  <div className="stats-row">
                    <div className="stat-item">
                      <span className="stat-number">
                        {jobDetail.statistics.views}
                      </span>
                      <span className="stat-label">Lượt xem</span>
                    </div>
                    <div className="stat-item">
                      <span className="stat-number">
                        {jobDetail.statistics.applicants}
                      </span>
                      <span className="stat-label">Ứng viên</span>
                    </div>
                    <div className="stat-item">
                      <span className="stat-number">
                        {jobDetail.statistics.shortlisted}
                      </span>
                      <span className="stat-label">Được chọn</span>
                    </div>
                  </div>
                </div>

                <Divider />

                {/* Contact Info */}
                <div className="recruiter-contact">
                  <h3>
                    <FaUsers /> Thông tin liên hệ
                  </h3>
                  <div className="contact-card">
                    <div className="contact-avatar">
                      <FaUsers />
                    </div>
                    <div className="contact-info">
                      <h4>{jobDetail.recruiter.fullName}</h4>
                      <p>{jobDetail.recruiter.positionName}</p>
                      <div className="contact-details">
                        <div className="contact-item">
                          <MdEmail />
                          <span>{jobDetail.recruiter.email}</span>
                        </div>
                        <div className="contact-item">
                          <MdPhone />
                          <span>{jobDetail.recruiter.phone}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          }
        />
      </div>

      {/* AI Analysis Loading Modal */}
      <AIAnalysisLoadingModal isOpen={isAnalyzing} loadingStep={loadingStep} />

      {/* AI Analysis Result Modal */}
      <AIAnalysisResultModal
        isOpen={showAnalysisModal}
        onClose={() => setShowAnalysisModal(false)}
        analysisResult={analysisResult}
      />
    </div>
  );
};

export default JobApplicationClient;
