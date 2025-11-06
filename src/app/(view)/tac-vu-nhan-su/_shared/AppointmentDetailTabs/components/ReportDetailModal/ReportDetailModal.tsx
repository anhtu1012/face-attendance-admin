"use client";

import { Modal, Card, Tag, Divider, Avatar } from "antd";
import React from "react";
import {
  FaFileAlt,
  FaUser,
  FaCalendarAlt,
  FaBriefcase,
  FaEnvelope,
  FaPhone,
  FaBuilding,
  FaCheckCircle,
  FaClock,
} from "react-icons/fa";
import "./ReportDetailModal.scss";
import { ReportInterview } from "@/dtos/tac-vu-nhan-su/phong-van-nhan-viec/report/report.dto";
import dayjs from "dayjs";

interface Props {
  open: boolean;
  onClose: () => void;
  report: ReportInterview | null;
  candidateName?: string;
}

const statusColorMap: Record<string, { color: string; text: string }> = {
  TO_INTERVIEW_R1: { color: "#1976D2", text: "Vòng 1" },
  TO_INTERVIEW_R2: { color: "#0288D1", text: "Vòng 2" },
  TO_INTERVIEW_R3: { color: "#0277BD", text: "Vòng 3" },
  TO_INTERVIEW_R4: { color: "#01579B", text: "Vòng 4" },
  TO_INTERVIEW_R5: { color: "#006064", text: "Vòng 5" },
  JOB_OFFERED: { color: "#43A047", text: "Đề xuất nhận việc" },
  INTERVIEW_REJECTED: { color: "#E53935", text: "Từ chối" },
  INTERVIEW_FAILED: { color: "#E53935", text: "Rớt Phỏng vấn " },
  NOT_SUITABLE: { color: "#FB8C00", text: "Chưa phù hợp" },
};

const ReportDetailModal: React.FC<Props> = ({
  open,
  onClose,
  report,
  candidateName,
}) => {
  if (!report) return null;

  const statusConfig = statusColorMap[report.status || ""] || {
    color: "#9E9E9E",
    text: report.status || "Không xác định",
  };

  return (
    <Modal
      title={
        <div className="modal-title">
          <FaFileAlt /> Chi tiết báo cáo phỏng vấn
        </div>
      }
      open={open}
      onCancel={onClose}
      footer={null}
      width={900}
      className="report-detail-modal"
    >
      <div className="report-detail-content">
        {/* Header Section */}
        <Card className="detail-header-card">
          <div className="header-top">
            <div className="header-info">
              <div className="candidate-section">
                <FaUser className="section-icon" />
                <div className="candidate-info">
                  <span className="label">Ứng viên:</span>
                  <span className="value">{candidateName || "N/A"}</span>
                </div>
              </div>
              <Tag
                style={{
                  background: statusConfig.color,
                  color: "#fff",
                  border: "none",
                  fontSize: "14px",
                  padding: "6px 16px",
                  borderRadius: "8px",
                }}
              >
                <FaCheckCircle style={{ marginRight: 6 }} />
                {statusConfig.text}
              </Tag>
            </div>

            <div className="time-info">
              <div className="time-item">
                <FaCalendarAlt className="time-icon" />
                <span className="time-label">Ngày tạo:</span>
                <span className="time-value">
                  {report.createdAt
                    ? dayjs(report.createdAt).format("DD/MM/YYYY HH:mm")
                    : "N/A"}
                </span>
              </div>
              {report.updatedAt && (
                <div className="time-item">
                  <FaClock className="time-icon" />
                  <span className="time-label">Cập nhật:</span>
                  <span className="time-value">
                    {dayjs(report.updatedAt).format("DD/MM/YYYY HH:mm")}
                  </span>
                </div>
              )}
            </div>
          </div>
        </Card>

        {/* Interviewer Section */}
        {report.interviewerInfo && (
          <Card className="interviewer-card" title="Thông tin người phỏng vấn">
            <div className="interviewer-content">
              <Avatar
                size={80}
                icon={<FaUser />}
                className="interviewer-avatar"
                style={{
                  background:
                    "linear-gradient(135deg, rgb(21, 101, 192), rgb(66, 165, 245))",
                }}
              />
              <div className="interviewer-details">
                <div className="interviewer-name">
                  {report.interviewerInfo.fullName}
                </div>
                <div className="interviewer-info-grid">
                  {report.interviewerInfo.email && (
                    <div className="info-item">
                      <FaEnvelope className="item-icon" />
                      <span className="item-label">Email:</span>
                      <a
                        href={`mailto:${report.interviewerInfo.email}`}
                        className="item-value link"
                      >
                        {report.interviewerInfo.email}
                      </a>
                    </div>
                  )}
                  {report.interviewerInfo.phone && (
                    <div className="info-item">
                      <FaPhone className="item-icon" />
                      <span className="item-label">Điện thoại:</span>
                      <a
                        href={`tel:${report.interviewerInfo.phone}`}
                        className="item-value link"
                      >
                        {report.interviewerInfo.phone}
                      </a>
                    </div>
                  )}
                  {report.interviewerInfo.roleName && (
                    <div className="info-item">
                      <FaBriefcase className="item-icon" />
                      <span className="item-label">Chức vụ:</span>
                      <span className="item-value">
                        {report.interviewerInfo.roleName}
                      </span>
                    </div>
                  )}
                  {report.interviewerInfo.departmentName && (
                    <div className="info-item">
                      <FaBuilding className="item-icon" />
                      <span className="item-label">Phòng ban:</span>
                      <span className="item-value">
                        {report.interviewerInfo.departmentName}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </Card>
        )}

        <Divider />

        {/* Description Section */}
        <Card className="description-card" title="Nội dung báo cáo">
          {report.description ? (
            <div
              className="description-content"
              dangerouslySetInnerHTML={{ __html: report.description }}
            />
          ) : (
            <div className="no-description">Không có nội dung báo cáo</div>
          )}
        </Card>
      </div>
    </Modal>
  );
};

export default ReportDetailModal;
