/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import LayoutContent from "@/components/LayoutContentForder/layoutContent";
import { trackEvent, trackUrlVisit } from "@/components/GoogleAnalytics";
import {
  Badge,
  Button,
  Card,
  DatePicker,
  Divider,
  Form,
  Input,
  message,
  Select,
  Tabs,
  Upload,
  UploadFile,
} from "antd";
// Use fetch directly for /api/views POSTs (credentials included)
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
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
import "./JobApplicationPage.scss";
import { useSelectData } from "@/hooks/useSelectData";
import ApplyServices from "@/services/apply/apply.service";

// Cookie TTL for dedupe (seconds). 24 hours = 86400 seconds
const COOKIE_TTL_SECONDS = 24 * 60 * 60;

interface JobApplicationFormData {
  fullName: string;
  email: string;
  phone: string;
  birthDay: Date;
  address: string;
  fileCV: File | null; // CV file
  gender: string;
  experience: string; // Số năm kinh nghiệm
  skillIds: string[]; // Kỹ năng
}

interface JobDetail {
  id: string;
  title: string;
  position: string;
  department: string;
  company: string;
  location: string;
  companyAddress: string;
  companyPhone: string;
  companyEmail: string;
  employmentType: string;
  experience: string;
  salaryMin: number;
  salaryMax: number;
  deadline: string;
  workingHours: string;
  probationPeriod: string;
  description: string;
  responsibilities: string;
  requirements: string;
  benefits: string;
  skillsRequired: string[];
  recruiter: {
    name: string;
    position: string;
    email: string;
    phone: string;
  };
  statistics: {
    views: number;
    applicants: number;
    shortlisted: number;
  };
  status: string;
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
  const jobId = params.jobId as string;
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [jobDetail, setJobDetail] = useState<JobDetail | null>(null);
  const [jobLoading, setJobLoading] = useState(true);
  const { selectSkill, selectGender } = useSelectData({ fetchSkill: true });

  useEffect(() => {
    if (!jobId) return;

    const load = async (id: string) => {
      setJobLoading(true);
      try {
        // Simulate API call - replace with actual API call
        await new Promise((resolve) => setTimeout(resolve, 1000));

        // Mock job data based on jobId
        const mockJobDetail: JobDetail = {
          id: id,
          title: "Senior Frontend Developer",
          position: "Developer",
          department: "Công Nghệ Thông Tin",
          company: "FaceAI Technology Solutions",
          location: "Hà Nội",
          companyAddress: "Tầng 5, Tòa nhà ABC, 123 Đường XYZ, Quận 1, TP.HCM",
          companyPhone: "(028) 1234-5678",
          companyEmail: "hr@faceai.vn",
          employmentType: "Toàn thời gian",
          experience: "3-5 năm",
          salaryMin: 25,
          salaryMax: 35,
          deadline: "2024-03-15",
          workingHours: "8:00 - 17:30 (T2-T6)",
          probationPeriod: "2 tháng",
          description:
            "<p>Chúng tôi đang tìm kiếm một <strong>Senior Frontend Developer</strong> tài năng để tham gia vào đội ngũ phát triển sản phẩm của chúng tôi. Bạn sẽ có cơ hội làm việc với các công nghệ hiện đại và đóng góp vào việc xây dựng các ứng dụng web tuyệt vời.</p>",
          responsibilities:
            "<ul><li>Phát triển các tính năng frontend mới sử dụng React, TypeScript</li><li>Tối ưu hóa hiệu suất ứng dụng và trải nghiệm người dùng</li><li>Review code và mentor các junior developers</li><li>Tham gia vào quy trình CI/CD và deployment</li><li>Hợp tác chặt chẽ với team Backend và Design</li></ul>",
          requirements:
            "<ul><li>Có ít nhất 3 năm kinh nghiệm với React, TypeScript</li><li>Thành thạo Next.js, Redux Toolkit, SCSS</li><li>Hiểu biết sâu về UI/UX principles và responsive design</li><li>Kinh nghiệm làm việc với RESTful API và GraphQL</li><li>Khả năng làm việc nhóm tốt và giao tiếp hiệu quả</li><li>Tiếng Anh giao tiếp cơ bản</li></ul>",
          benefits:
            "<ul><li>Lương thưởng hấp dẫn theo năng lực (25-35 triệu VNĐ)</li><li>Bảo hiểm sức khỏe cao cấp cho bản thân và gia đình</li><li>Thưởng hiệu suất định kỳ và thưởng dự án</li><li>Du lịch hàng năm cùng công ty</li><li>Cơ hội đào tạo và phát triển nghề nghiệp</li><li>Môi trường làm việc hiện đại, thân thiện</li></ul>",
          skillsRequired: [
            "React",
            "TypeScript",
            "Next.js",
            "SCSS",
            "Redux",
            "Git",
          ],
          recruiter: {
            name: "Nguyễn Thị Lan Anh",
            position: "HR Manager",
            email: "lananh.nguyen@faceai.vn",
            phone: "0912-345-678",
          },
          statistics: { views: 245, applicants: 32, shortlisted: 8 },
          status: "Active",
        };

        // Apply initialViews from server if provided
        if (typeof initialViews === "number") {
          mockJobDetail.statistics.views = initialViews;
        }
        setJobDetail(mockJobDetail);

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
                  body: JSON.stringify({ jobId: id }),
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
        message.error("Không thể tải thông tin công việc!");
      } finally {
        setJobLoading(false);
      }
    };

    load(jobId);
  }, [jobId, initialViewed, initialViews]);

  const handleSubmitApplication = async (values: JobApplicationFormData) => {
    setLoading(true);
    try {
      console.log("Application data:", values);
      console.log("Job ID:", jobId);
      // Build multipart/form-data
      const formData = new FormData();
      const fileCVUploadFile = values.fileCV as any;
      const fileCVOriginFile: File | undefined =
        fileCVUploadFile?.originFileObj;
      if (fileCVOriginFile) {
        formData.append("fileCV", fileCVOriginFile, fileCVOriginFile.name);
      }

      // Append each field as string
      Object.entries(values).forEach(([key, value]) => {
        formData.append(key, String(value));
      });

      await ApplyServices.createRecruitmentMultipart(formData);
      // Track application submission start
      trackEvent("application_start", "job_application", `job_${jobId}`);
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));
      // Track successful application submission
      trackEvent("application_success", "job_application", `job_${jobId}`);
      message.success(
        "Ứng tuyển thành công! Chúng tôi sẽ liên hệ với bạn sớm."
      );
      form.resetFields();
    } catch (error) {
      console.error("Error submitting application:", error);
      // Track failed application submission
      trackEvent("application_error", "job_application", `job_${jobId}`);
      message.error("Có lỗi xảy ra khi ứng tuyển!");
    } finally {
      setLoading(false);
    }
  };

  const experienceYearsOptions = [
    { value: "0", label: "Chưa có kinh nghiệm" },
    { value: "0.5", label: "6 tháng" },
    { value: "1", label: "1 năm" },
    { value: "1.5", label: "1 năm rưỡi" },
    { value: "2", label: "2 năm" },
    { value: "2.5", label: "2 năm rưỡi" },
    { value: "3", label: "3 năm" },
    { value: "3.5", label: "3 năm rưỡi" },
    { value: "4", label: "4 năm" },
    { value: "4.5", label: "4 năm rưỡi" },
    { value: "5", label: "5 năm" },
    { value: "5.5", label: "5 năm rưỡi" },
    { value: "6", label: "6 năm" },
    { value: "6.5", label: "6 năm rưỡi" },
    { value: "7", label: "7 năm" },
    { value: "7.5", label: "7 năm rưỡi" },
    { value: "8", label: "8 năm" },
    { value: "8.5", label: "8 năm rưỡi" },
    { value: "9", label: "9 năm" },
    { value: "9.5", label: "9 năm rưỡi" },
    { value: "10", label: "10+ năm" },
  ];

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
        message.error("Chỉ hỗ trợ file PDF, DOC, DOCX!");
        return false;
      }
      const isValidSize = file.size / 1024 / 1024 < 5;
      if (!isValidSize) {
        message.error("File không được vượt quá 5MB!");
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
        message.info("Preview chỉ khả dụng cho file PDF");
      }
    },
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "active":
        return "#52c41a";
      case "pending":
        return "#faad14";
      case "closed":
        return "#f5222d";
      default:
        return "#d9d9d9";
    }
  };

  const getStatusText = (status: string) => {
    switch (status.toLowerCase()) {
      case "active":
        return "Đang tuyển dụng";
      case "pending":
        return "Chờ phê duyệt";
      case "closed":
        return "Đã đóng";
      default:
        return status;
    }
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
            Công việc có ID &quot;{jobId}&quot; không tồn tại hoặc đã bị xóa.
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
              <h1>{jobDetail.company}</h1>
            </div>
          </div>
          <div className="company-contact">
            <div className="contact-top">
              <div className="contact-item">
                <FaPhone className="contact-icon" />
                <span>{jobDetail.companyPhone}</span>
              </div>
              <div className="contact-item">
                <FaEnvelope className="contact-icon" />
                <span>{jobDetail.companyEmail}</span>
              </div>
              <div className="contact-item">
                <FaMapMarkerAlt className="contact-icon" />
                <span className="address-text">{jobDetail.location}</span>
              </div>
            </div>
            <div className="contact-bottom">
              <div className="contact-item">
                <FaMapMarkerAlt className="contact-icon" />
                <span>{jobDetail.companyAddress}</span>
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
                >
                  <Tabs
                    defaultActiveKey="1"
                    items={[
                      {
                        key: "1",
                        label: "Thông tin",
                        children: (
                          <>
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
                                      message:
                                        "Họ tên phải có ít nhất 2 ký tự!",
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
                                  name="birthDay"
                                  label="Ngày sinh"
                                  // validate on change so the age validator runs immediately after user picks a date
                                  validateTrigger={["onChange", "onBlur"]}
                                  rules={[
                                    {
                                      required: true,
                                      message: "Vui lòng chọn ngày sinh!",
                                    },
                                    {
                                      validator: (
                                        _: unknown,
                                        value: unknown
                                      ) => {
                                        // If no value, let the required rule handle it
                                        if (!value) return Promise.resolve();

                                        // Support objects from date libraries with toDate(), native Date, or parsable strings
                                        let selectedDate: Date;
                                        const v = value as unknown;
                                        if (
                                          v &&
                                          typeof (v as { toDate?: () => Date })
                                            .toDate === "function"
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
                                          today.getMonth() -
                                          selectedDate.getMonth();
                                        if (
                                          m < 0 ||
                                          (m === 0 &&
                                            today.getDate() <
                                              selectedDate.getDate())
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
                              <div style={{ display: "none" }}>
                                <Form.Item name="jobApplicationFormId ">
                                  <input />
                                </Form.Item>
                              </div>
                            </div>
                          </>
                        ),
                      },
                      {
                        key: "2",
                        label: "Kinh nghiệm",
                        children: (
                          <>
                            <div className="form-row">
                              <div className="form-col-6">
                                <Form.Item
                                  name="experience"
                                  label="Số năm kinh nghiệm"
                                  rules={[
                                    {
                                      required: true,
                                      message:
                                        "Vui lòng chọn số năm kinh nghiệm!",
                                    },
                                  ]}
                                >
                                  <Select
                                    placeholder="Chọn hoặc nhập số năm kinh nghiệm"
                                    options={experienceYearsOptions}
                                    className="custom-select"
                                    size="large"
                                  />
                                </Form.Item>
                              </div>
                              <div className="form-col-6">
                                <Form.Item
                                  name="skillIds "
                                  label="Kỹ năng"
                                  rules={[
                                    {
                                      required: true,
                                      message: "Vui lòng chọn kỹ năng!",
                                    },
                                  ]}
                                >
                                  <Select
                                    mode="tags"
                                    placeholder="Chọn hoặc nhập kỹ năng của bạn"
                                    options={selectSkill}
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
                                  label="Upload CV"
                                  rules={[
                                    {
                                      required: true,
                                      message: "Vui lòng upload CV!",
                                    },
                                  ]}
                                >
                                  <Upload.Dragger
                                    {...uploadProps}
                                    className="cv-upload"
                                  >
                                    <div className="upload-content">
                                      <FaCloudUploadAlt className="upload-icon" />
                                      <p className="upload-text">
                                        Kéo thả file CV vào đây hoặc{" "}
                                        <span>click để chọn file</span>
                                      </p>
                                      <p className="upload-hint">
                                        Hỗ trợ: PDF, DOC, DOCX (tối đa 5MB)
                                      </p>
                                    </div>
                                  </Upload.Dragger>
                                </Form.Item>
                              </div>
                            </div>
                          </>
                        ),
                      },
                    ]}
                  />

                  <div className="form-actions">
                    <Button
                      type="primary"
                      htmlType="submit"
                      loading={loading}
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
                    <h1 className="job-title">{jobDetail.title}</h1>
                    <div className="job-meta">
                      <Badge
                        color={getStatusColor(jobDetail.status)}
                        text={getStatusText(jobDetail.status)}
                        className="status-badge"
                      />
                      <span className="company-name">
                        <FaBuilding /> {jobDetail.company}
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
                        <span className="info-value">{jobDetail.location}</span>
                      </div>
                    </div>

                    <div className="info-item">
                      <FaMoneyBillWave className="info-icon" />
                      <div className="info-text">
                        <span className="info-label">Mức lương</span>
                        <span className="info-value">
                          {jobDetail.salaryMin}-{jobDetail.salaryMax} triệu VNĐ
                        </span>
                      </div>
                    </div>

                    <div className="info-item">
                      <FaClock className="info-icon" />
                      <div className="info-text">
                        <span className="info-label">Kinh nghiệm</span>
                        <span className="info-value">
                          {jobDetail.experience}
                        </span>
                      </div>
                    </div>

                    <div className="info-item">
                      <FaCalendarAlt className="info-icon" />
                      <div className="info-text">
                        <span className="info-label">Hạn nộp</span>
                        <span className="info-value">{jobDetail.deadline}</span>
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
                    dangerouslySetInnerHTML={{ __html: jobDetail.description }}
                  />
                </div>

                <div className="job-responsibilities">
                  <h3>
                    <FaStar /> Trách nhiệm công việc
                  </h3>
                  <div
                    className="content"
                    dangerouslySetInnerHTML={{
                      __html: jobDetail.responsibilities,
                    }}
                  />
                </div>

                <div className="job-requirements">
                  <h3>
                    <FaFileAlt /> Yêu cầu ứng viên
                  </h3>
                  <div
                    className="content"
                    dangerouslySetInnerHTML={{ __html: jobDetail.requirements }}
                  />
                </div>

                <div className="job-benefits">
                  <h3>
                    <FaCheck /> Quyền lợi
                  </h3>
                  <div
                    className="content"
                    dangerouslySetInnerHTML={{ __html: jobDetail.benefits }}
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
                      <h4>{jobDetail.recruiter.name}</h4>
                      <p>{jobDetail.recruiter.position}</p>
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
    </div>
  );
};

export default JobApplicationClient;
