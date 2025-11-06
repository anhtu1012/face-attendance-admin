"use client";

import { Button, Card, Modal, Tag, Empty } from "antd";
import React, { useState } from "react";
import {
  FaFileAlt,
  FaUser,
  FaCalendarAlt,
  FaBriefcase,
  FaEye,
  FaCheckCircle,
} from "react-icons/fa";
import "./ReportListModal.scss";
import { ReportInterview } from "@/dtos/tac-vu-nhan-su/phong-van-nhan-viec/report/report.dto";
import dayjs from "dayjs";
import ReportDetailModal from "../ReportDetailModal/ReportDetailModal";

interface Props {
  open: boolean;
  onClose: () => void;
  reports: ReportInterview[];
  candidateName?: string;
  onViewDetail?: (report: ReportInterview) => void;
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

const ReportListModal: React.FC<Props> = ({
  open,
  onClose,
  reports,
  candidateName,
  onViewDetail,
}) => {
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [selectedReport, setSelectedReport] = useState<ReportInterview | null>(
    null
  );

  // Strip HTML tags for preview
  const getTextPreview = (html: string, maxLength: number = 150) => {
    const div = document.createElement("div");
    div.innerHTML = html;
    const text = div.textContent || div.innerText || "";
    return text.length > maxLength
      ? text.substring(0, maxLength) + "..."
      : text;
  };

  const handleViewDetail = (report: ReportInterview) => {
    setSelectedReport(report);
    setDetailModalOpen(true);
    if (onViewDetail) {
      onViewDetail(report);
    }
  };

  return (
    <Modal
      title={
        <div className="modal-title">
          <FaFileAlt /> Danh sách báo cáo{" "}
          {candidateName && (
            <span className="candidate-name">- {candidateName}</span>
          )}
        </div>
      }
      open={open}
      onCancel={onClose}
      footer={null}
      width={900}
      className="report-list-modal"
    >
      <div className="report-list">
        {reports.length === 0 ? (
          <Empty
            description="Chưa có báo cáo nào"
            image={Empty.PRESENTED_IMAGE_SIMPLE}
          />
        ) : (
          reports.map((report) => {
            const statusConfig = statusColorMap[report.status || ""] || {
              color: "#9E9E9E",
              text: report.status || "Không xác định",
            };

            return (
              <Card key={report.id} className="report-card">
                <div className="card-header">
                  <div className="card-title-row">
                    <div className="card-title">
                      <FaCheckCircle size={18} style={{ marginRight: 8 }} />
                      Báo cáo phỏng vấn
                    </div>
                    <Tag
                      style={{
                        background: statusConfig.color,
                        color: "#fff",
                        border: "none",
                      }}
                    >
                      {statusConfig.text}
                    </Tag>
                  </div>
                  <div className="card-datetime">
                    <FaCalendarAlt size={14} />
                    {report.createdAt
                      ? dayjs(report.createdAt).format("DD/MM/YYYY HH:mm")
                      : "Chưa có ngày"}
                  </div>
                </div>

                <div className="card-body">
                  {report.interviewerInfo && (
                    <div className="card-info-row">
                      <span className="info-label">
                        <FaUser /> Người phỏng vấn:
                      </span>
                      <div className="interviewer-info">
                        <span className="interviewer-name">
                          {report.interviewerInfo.fullName}
                        </span>
                        {report.interviewerInfo.email && (
                          <span className="interviewer-email">
                            ({report.interviewerInfo.email})
                          </span>
                        )}
                        {report.interviewerInfo.departmentName && (
                          <span className="interviewer-dept">
                            • {report.interviewerInfo.departmentName}
                          </span>
                        )}
                      </div>
                    </div>
                  )}

                  {report.interviewerInfo?.roleName && (
                    <div className="card-info-row">
                      <span className="info-label">
                        <FaBriefcase /> Chức vụ:
                      </span>
                      <span className="info-value">
                        {report.interviewerInfo.roleName}
                      </span>
                    </div>
                  )}

                  {report.description && (
                    <div className="card-info-row description-row">
                      <span className="info-label">
                        <FaFileAlt /> Nội dung:
                      </span>
                      <div className="description-preview">
                        {getTextPreview(report.description)}
                      </div>
                    </div>
                  )}
                </div>

                <div className="card-footer">
                  <Button
                    type="primary"
                    icon={<FaEye />}
                    onClick={() => handleViewDetail(report)}
                  >
                    Xem chi tiết
                  </Button>
                </div>
              </Card>
            );
          })
        )}
      </div>

      {/* Report Detail Modal */}
      <ReportDetailModal
        open={detailModalOpen}
        onClose={() => {
          setDetailModalOpen(false);
          setSelectedReport(null);
        }}
        report={selectedReport}
        candidateName={candidateName}
      />
    </Modal>
  );
};

export default ReportListModal;
