"use client";

import { useAntdMessage } from "@/hooks/AntdMessageProvider";
import { Button, Card, DatePicker, Form, Input, Modal, TimePicker } from "antd";
import dayjs, { Dayjs } from "dayjs";
import React, { useEffect, useMemo, useState } from "react";
import {
  FaBuilding,
  FaDownload,
  FaEnvelope,
  FaPhone,
  FaUser,
  FaChevronDown,
  FaChevronUp,
  FaList,
  FaTh,
} from "react-icons/fa";
import { MdLocationOn } from "react-icons/md";
import JobOfferInvitation from "./JobOfferInvitation";
import "./JobOfferModal.scss";
import { generateJobOfferHTML } from "./jobOfferTemplateHTML";

const { TextArea } = Input;

interface CandidateData {
  id: string;
  fullName: string;
  email: string;
  phone: string;
}

interface JobOfferModalProps {
  open: boolean;
  onClose: () => void;
  candidateData?: CandidateData | CandidateData[];
}

interface JobOfferFormData {
  date: Dayjs | null;
  startTime: Dayjs | null;
  endTime: Dayjs | null;
  address: string;
  username: string;
  password: string;
  appDownloadLink: string;
  guidePersonName: string;
  guidePersonPhone: string;
  guidePersonEmail: string;
  notes?: string;
}

interface CompanyLocation {
  id: string;
  name: string;
  address: string;
  mapUrl: string;
}

interface JobOfferDetails {
  candidate: {
    id: string;
    fullName: string;
    email: string;
    phone: string;
  };
  date: string;
  startTime: string;
  endTime: string;
  address: string;
  username: string;
  password: string;
  appDownloadLink: string;
  guidePersonName: string;
  guidePersonPhone: string;
  guidePersonEmail: string;
  notes: string;
  fullDateTime: string;
}

export type { JobOfferDetails };

const JobOfferModal: React.FC<JobOfferModalProps> = ({
  open,
  onClose,
  candidateData,
}) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [showInvitation, setShowInvitation] = useState(false);
  const [jobOfferDetails, setJobOfferDetails] =
    useState<JobOfferDetails | null>(null);
  const [showCandidateList, setShowCandidateList] = useState(true);
  const [displayMode, setDisplayMode] = useState<"list" | "chips">("list");

  const messageApi = useAntdMessage();

  // Normalize candidateData to array
  const candidates = useMemo(() => {
    if (!candidateData) return [];
    return Array.isArray(candidateData) ? candidateData : [candidateData];
  }, [candidateData]);

  // Company location (only one location)
  const companyLocation: CompanyLocation = {
    id: "hq",
    name: "FaceAI Technology Solutions",
    address: "Tầng 5, Tòa nhà ABC, 123 Đường XYZ, Quận Ba Đình, Hà Nội",
    mapUrl: "https://maps.google.com/?q=123+Đường+XYZ+Quận+Ba+Đình+Hà+Nội",
  };

  useEffect(() => {
    if (open && candidateData) {
      form.resetFields();
      setShowInvitation(false);
      setJobOfferDetails(null);
      // Set default values
      form.setFieldsValue({
        address: companyLocation.address,
        appDownloadLink: "https://faceai.app/download",
      });
    }
  }, [open, candidateData, form, companyLocation.address]);

  const handleSubmit = async (values: JobOfferFormData) => {
    if (candidates.length === 0) return;

    setLoading(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // For now, use the first candidate for details
      // TODO: Handle multiple candidates properly
      const firstCandidate = candidates[0];

      const details: JobOfferDetails = {
        candidate: firstCandidate,
        date: values.date?.format("DD/MM/YYYY") || "",
        startTime: values.startTime?.format("HH:mm") || "",
        endTime: values.endTime?.format("HH:mm") || "",
        address: values.address,
        username: values.username,
        password: values.password,
        appDownloadLink: values.appDownloadLink,
        guidePersonName: values.guidePersonName,
        guidePersonPhone: values.guidePersonPhone,
        guidePersonEmail: values.guidePersonEmail,
        notes: values.notes || "",
        fullDateTime: `${values.date?.format(
          "DD/MM/YYYY"
        )} từ ${values.startTime?.format("HH:mm")} đến ${values.endTime?.format(
          "HH:mm"
        )}`,
      };

      setJobOfferDetails(details);
      setShowInvitation(true);

      messageApi.success("Tạo lịch hẹn nhận việc thành công!");
    } catch {
      messageApi.error("Có lỗi xảy ra khi tạo lịch hẹn nhận việc!");
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadInvitation = async () => {
    if (!jobOfferDetails) return;

    try {
      // Dynamic import for html2canvas
      const html2canvas = (await import("html2canvas")).default;

      // Create a temporary div to render the invitation
      const tempDiv = document.createElement("div");
      tempDiv.style.width = "800px";
      tempDiv.style.background = "white";
      tempDiv.style.padding = "40px";
      tempDiv.style.fontFamily = "Arial, sans-serif";
      tempDiv.style.position = "absolute";
      tempDiv.style.left = "-9999px";
      document.body.appendChild(tempDiv);

      // Create invitation HTML content using the template
      tempDiv.innerHTML = generateJobOfferHTML(jobOfferDetails);

      // Use html2canvas to convert to image
      const canvas = await html2canvas(tempDiv, {
        useCORS: true,
        allowTaint: true,
      });

      // Convert canvas to blob and download
      canvas.toBlob((blob) => {
        if (blob) {
          const url = URL.createObjectURL(blob);
          const link = document.createElement("a");
          link.href = url;
          link.download = `Thu_moi_nhan_viec_${jobOfferDetails.candidate.fullName}.png`;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          URL.revokeObjectURL(url);

          messageApi.success("Đã tải ảnh thư mời nhận việc!");
        }
      }, "image/png");

      // Clean up
      document.body.removeChild(tempDiv);
    } catch (error) {
      console.error("Error generating invitation image:", error);
      messageApi.error("Có lỗi xảy ra khi tạo ảnh thư mời!");
    }
  };

  const handleClose = () => {
    form.resetFields();
    setShowInvitation(false);
    setJobOfferDetails(null);
    onClose();
  };

  const disabledDate = (current: Dayjs) => {
    return current && current < dayjs().startOf("day");
  };

  if (showInvitation && jobOfferDetails) {
    return (
      <Modal
        title={
          <div className="modal-title">
            <FaBuilding /> Thư mời nhận việc
          </div>
        }
        open={open}
        onCancel={handleClose}
        centered={false}
        footer={[
          <Button key="close" onClick={handleClose}>
            Đóng
          </Button>,
          <Button
            key="download"
            type="primary"
            icon={<FaDownload />}
            onClick={handleDownloadInvitation}
            className="download-btn"
          >
            Tải ảnh thư mời
          </Button>,
        ]}
        width={1500}
        className="job-offer-invitation-modal"
      >
        <div className="invitation-content">
          <JobOfferInvitation jobOfferDetails={jobOfferDetails} />
        </div>
      </Modal>
    );
  }

  return (
    <Modal
      title={
        <div className="modal-title">
          <FaBuilding /> Tạo lịch hẹn nhận việc
        </div>
      }
      open={open}
      onCancel={handleClose}
      centered={false}
      footer={[
        <Button key="cancel" onClick={handleClose} size="large">
          Hủy
        </Button>,
        <Button
          key="submit"
          type="primary"
          loading={loading}
          size="large"
          className="submit-btn"
          onClick={() => form.submit()}
        >
          {loading ? "Đang tạo lịch..." : "Tạo lịch hẹn nhận việc"}
        </Button>,
      ]}
      width={900}
      className="job-offer-modal"
    >
      <div className="modal-content">
        {candidates.length > 0 && (
          <Card className="candidate-card" size="small">
            <div className="candidate-info-header">
              <div className="candidate-section-title">
                <FaUser style={{ marginRight: "8px" }} />
                <span>Danh sách ứng viên</span>
              </div>
              <div className="candidate-count-badge-wrapper">
                <div className="display-mode-toggle">
                  <button
                    className={`mode-btn ${
                      displayMode === "list" ? "active" : ""
                    }`}
                    onClick={() => setDisplayMode("list")}
                    title="Hiển thị dạng danh sách"
                  >
                    <FaList />
                  </button>
                  <button
                    className={`mode-btn ${
                      displayMode === "chips" ? "active" : ""
                    }`}
                    onClick={() => setDisplayMode("chips")}
                    title="Hiển thị dạng chips"
                  >
                    <FaTh />
                  </button>
                </div>
                <div
                  className="candidate-count-badge"
                  onClick={() => setShowCandidateList(!showCandidateList)}
                >
                  <span className="count-number">{candidates.length}</span>
                  <span className="count-label">ứng viên</span>
                  {showCandidateList ? (
                    <FaChevronUp className="toggle-icon" />
                  ) : (
                    <FaChevronDown className="toggle-icon" />
                  )}
                </div>
              </div>
            </div>

            {showCandidateList && displayMode === "list" && (
              <div className="candidates-list">
                {candidates.map((candidate, index) => (
                  <div key={candidate.id} className="candidate-item">
                    <div className="candidate-number">{index + 1}</div>
                    <div className="candidate-info-content">
                      <h4 className="candidate-name">{candidate.fullName}</h4>
                      <div className="candidate-contact-details">
                        <div className="candidate-detail-item">
                          <FaEnvelope className="detail-icon" />
                          <span className="detail-text">{candidate.email}</span>
                        </div>
                        <div className="candidate-detail-item">
                          <FaPhone className="detail-icon" />
                          <span className="detail-text">{candidate.phone}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {showCandidateList && displayMode === "chips" && (
              <div className="candidates-chips">
                {candidates.map((candidate, index) => (
                  <div key={candidate.id} className="candidate-chip">
                    <span className="chip-number">{index + 1}</span>
                    <span className="chip-name">{candidate.fullName}</span>
                  </div>
                ))}
              </div>
            )}
          </Card>
        )}

        <div className="form-container">
          <div className="form-section">
            <Form
              form={form}
              layout="vertical"
              onFinish={handleSubmit}
              labelCol={{ span: 24 }}
              className="job-offer-form"
            >
              <div className="form-section-title">
                <FaBuilding />
                Thông tin thời gian và địa điểm
              </div>

              <div className="form-row">
                <div className="form-col-6">
                  <Form.Item
                    name="date"
                    label="Ngày nhận việc"
                    rules={[
                      {
                        required: true,
                        message: "Vui lòng chọn ngày nhận việc!",
                      },
                    ]}
                  >
                    <DatePicker
                      placeholder="Chọn ngày"
                      style={{ width: "100%" }}
                      format="DD/MM/YYYY"
                      disabledDate={disabledDate}
                      size="large"
                    />
                  </Form.Item>
                </div>
                <div className="form-col-6">
                  <Form.Item
                    name="startTime"
                    label="Giờ bắt đầu"
                    rules={[
                      { required: true, message: "Vui lòng chọn giờ bắt đầu!" },
                    ]}
                  >
                    <TimePicker
                      placeholder="Giờ bắt đầu"
                      style={{ width: "100%" }}
                      format="HH:mm"
                      size="large"
                    />
                  </Form.Item>
                </div>
              </div>

              <Form.Item
                name="address"
                label="Địa chỉ nhận việc"
                rules={[
                  {
                    required: true,
                    message: "Vui lòng nhập địa chỉ nhận việc!",
                  },
                ]}
              >
                <Input
                  placeholder="Nhập địa chỉ chi tiết"
                  size="large"
                  prefix={<MdLocationOn />}
                />
              </Form.Item>

              <Form.Item name="notes" label="Ghi chú">
                <TextArea
                  rows={4}
                  placeholder="Ghi chú thêm về buổi nhận việc (không bắt buộc)"
                />
              </Form.Item>
            </Form>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default JobOfferModal;
