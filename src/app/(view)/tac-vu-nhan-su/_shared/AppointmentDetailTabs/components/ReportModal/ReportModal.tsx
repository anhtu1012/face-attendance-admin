"use client";
import React, { useState } from "react";
import { Button, Modal, Select, Row, Col } from "antd";
import { TuyenDungItem } from "@/dtos/tac-vu-nhan-su/tuyen-dung/tuyen-dung.dto";
import RichTextEditor from "@/components/RichTextEditor";
import { FaFileAlt, FaUser, FaEnvelope, FaPhone } from "react-icons/fa";
import "./ReportModal.scss";
import { CreateInterviewReportRequest } from "@/dtos/tac-vu-nhan-su/phong-van-nhan-viec/interview.request.dto";

interface ReportModalProps {
  open: boolean;
  onClose: () => void;
  candidate: TuyenDungItem | null;
  onSubmit: (payload: {
    candidateId?: string;
    status: CreateInterviewReportRequest["status"];
    description: string;
  }) => Promise<void>;
}

const REPORT_STATUS_OPTIONS = [
  { label: "Đã đầu phỏng vấn vòng 1", value: "TO_INTERVIEW_R1" }, //2
  { label: "Đã đầu phỏng vấn vòng 2", value: "TO_INTERVIEW_R2" }, //2
  { label: "Đã đầu phỏng vấn vòng 3", value: "TO_INTERVIEW_R3" }, //2
  { label: "Đã đầu phỏng vấn vòng 4", value: "TO_INTERVIEW_R4" }, //2
  { label: "Đã đầu phỏng vấn vòng 5", value: "TO_INTERVIEW_R5" }, //2
  { label: "Hẹn lại", value: "INTERVIEW_RESCHEDULED" }, //2
  { label: "Rớt phỏng vấn", value: "INTERVIEW_FAILED" }, //2
  { label: "Không đến phỏng vấn", value: "NOT_COMING_INTERVIEW" }, //5
  { label: "Nhận việc", value: "JOB_OFFERED" }, //3
];

const ReportModal: React.FC<ReportModalProps> = ({
  open,
  onClose,
  candidate,
  onSubmit,
}) => {
  const [reportStatus, setReportStatus] = useState<string>("");
  const [reportDescription, setReportDescription] = useState<string>("1");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!reportStatus) {
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        candidateId: candidate?.id,
        status: reportStatus as CreateInterviewReportRequest["status"],
        description: reportDescription,
      };
      await onSubmit(payload);
      // Reset state
      setReportStatus("");
      setReportDescription("1");
    } catch (error) {
      console.error("Submit error:", error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleClose = () => {
    setReportStatus("");
    setReportDescription("1");
    onClose();
  };

  return (
    <Modal
      title={
        <div className="report-modal-title">
          <FaFileAlt className="title-icon" />
          <span>Báo cáo ứng viên</span>
        </div>
      }
      open={open}
      onCancel={handleClose}
      width={920}
      className="report-modal"
      footer={[
        <Button key="cancel" onClick={handleClose} disabled={submitting}>
          Hủy
        </Button>,
        <Button
          key="submit"
          type="primary"
          onClick={handleSubmit}
          loading={submitting}
          disabled={!reportStatus}
        >
          Gửi báo cáo
        </Button>,
      ]}
    >
      <div className="report-modal-content">
        {/* Candidate Info Card */}
        {candidate && (
          <div className="candidate-info-card">
            <div className="candidate-avatar-section">
              <div className="avatar-wrapper">
                <FaUser className="avatar-icon" />
              </div>
              <div className="candidate-details">
                <h3 className="candidate-name">{candidate.fullName}</h3>
                <p className="candidate-meta">
                  {candidate.gender === "M"
                    ? "Nam"
                    : candidate.gender === "F"
                    ? "Nữ"
                    : ""}
                </p>
              </div>
            </div>
            <div className="contact-details">
              <div className="contact-item">
                <FaEnvelope className="contact-icon" />
                <span>{candidate.email}</span>
              </div>
              <div className="contact-item">
                <FaPhone className="contact-icon" />
                <span>{candidate.phone}</span>
              </div>
            </div>
          </div>
        )}

        {/* Form Fields - using AntD Row/Col for responsive layout */}
        <div className="report-form">
          <Row gutter={[16, 16]}>
            <Col xs={24} md={24} style={{ width: "100%" }}>
              <div className="form-field">
                <label className="field-label">
                  Trạng thái <span className="required">*</span>
                </label>
                <Select
                  value={reportStatus}
                  onChange={(val) => setReportStatus(val)}
                  placeholder="Chọn trạng thái báo cáo"
                  className="status-select"
                  size="large"
                  style={{ width: "100%" }}
                  options={REPORT_STATUS_OPTIONS}
                />
              </div>
            </Col>

            <Col xs={24} md={24}>
              <div className="form-field">
                <label className="field-label">
                  Mô tả chi tiết <span className="required">*</span>
                </label>
                <div className="editor-wrapper">
                  <RichTextEditor
                    value={reportDescription}
                    onChange={(val) => setReportDescription(val)}
                    height={450}
                    placeholder="Nhập mô tả chi tiết về báo cáo..."
                  />
                </div>
              </div>
            </Col>
          </Row>
        </div>
      </div>
    </Modal>
  );
};

export default ReportModal;
