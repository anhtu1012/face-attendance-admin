"use client";
import { Button, Divider, Modal, Rate } from "antd";
import { useAntdMessage } from "@/hooks/AntdMessageProvider";
import React, { useCallback, useEffect, useState } from "react";
import {
  FaEnvelope,
  FaFileAlt,
  FaMoneyBillWave,
  FaPhone,
  FaStar,
  FaUser,
} from "react-icons/fa";
import "./LeaderReportModal.scss";

interface CandidateData {
  id: string;
  fullName: string;
  email: string;
  phone: string;
}

interface LeaderReportModalProps {
  open: boolean;
  onClose: () => void;
  candidateData?: CandidateData;
}

interface ReportData {
  salary: number;
  rating: number;
  detailedReport: string;
}

const LeaderReportModal: React.FC<LeaderReportModalProps> = ({
  open,
  onClose,
  candidateData,
}) => {
  const [loading, setLoading] = useState(false);
  const [reportData, setReportData] = useState<ReportData>({
    salary: 0,
    rating: 0,
    detailedReport: "",
  });

  const messageApi = useAntdMessage();

  const loadReportData = useCallback(
    async (candidateId: string) => {
      try {
        setLoading(true);
        // Simulate API call to load existing report
        console.log("Loading report data for candidate:", candidateId);

        // Mock data for demonstration
        const mockData: ReportData = {
          salary: 15000000,
          rating: 4.5,
          detailedReport: `
          <h3>Báo cáo đánh giá nhân viên</h3>
          
          <h4>Điểm mạnh:</h4>
          <ul>
            <li>Có khả năng học hỏi nhanh và thích ứng tốt với môi trường làm việc</li>
            <li>Thái độ làm việc tích cực, nhiệt tình và có trách nhiệm cao</li>
            <li>Kỹ năng giao tiếp tốt, hòa đồng với đồng nghiệp</li>
            <li>Có tư duy logic và khả năng giải quyết vấn đề hiệu quả</li>
            <li>Chủ động trong công việc và có khả năng làm việc độc lập</li>
          </ul>
        `,
        };

        setReportData(mockData);
      } catch (error) {
        console.error("Error loading report data:", error);
        messageApi.error("Không thể tải dữ liệu báo cáo");
      } finally {
        setLoading(false);
      }
    },
    [messageApi]
  );

  useEffect(() => {
    if (open && candidateData) {
      loadReportData(candidateData.id);
    }
  }, [open, candidateData, loadReportData]);

  const formatSalary = (amount: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  const handleClose = () => {
    setReportData({
      salary: 0,
      rating: 0,
      detailedReport: "",
    });
    onClose();
  };

  return (
    <Modal
      title={
        <div className="modal-title">
          <FaFileAlt className="title-icon" />
          <span>Báo cáo từ Leader</span>
        </div>
      }
      open={open}
      onCancel={handleClose}
      width={900}
      className="leader-report-modal"
      footer={[
        <Button key="close" type="primary" onClick={handleClose}>
          Đóng
        </Button>,
      ]}
      loading={loading}
    >
      <div className="modal-content">
        {candidateData && (
          <div className="candidate-card">
            <div className="candidate-info-header">
              <div className="candidate-info">
                <div className="candidate-avatar">
                  <FaUser />
                </div>
                <div className="candidate-name-section">
                  <h3 className="candidate-name">{candidateData.fullName}</h3>
                  <p className="candidate-title">Nhân viên đã tuyển dụng</p>
                </div>
              </div>
              <div className="candidate-details">
                <div className="candidate-detail-item">
                  <FaEnvelope className="detail-icon" />
                  <span className="detail-text">{candidateData.email}</span>
                </div>
                <div className="candidate-detail-item">
                  <FaPhone className="detail-icon" />
                  <span className="detail-text">{candidateData.phone}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        <Divider />

        <div className="report-content">
          <div className="report-summary">
            <div className="summary-grid">
              <div className="summary-item">
                <div className="summary-header">
                  <FaMoneyBillWave className="summary-icon salary-icon" />
                  <span className="summary-title">Lương đề xuất</span>
                </div>
                <div className="summary-value salary-value">
                  {formatSalary(reportData.salary)}
                </div>
              </div>

              <div className="summary-item">
                <div className="summary-header">
                  <FaStar className="summary-icon rating-icon" />
                  <span className="summary-title">Đánh giá tổng thể</span>
                </div>
                <div className="summary-value rating-value">
                  <Rate
                    disabled
                    allowHalf
                    value={reportData.rating}
                    style={{ fontSize: "20px" }}
                  />
                  <span className="rating-text">({reportData.rating}/5)</span>
                </div>
              </div>
            </div>
          </div>

          <div className="detailed-report-section">
            <h4 className="section-title">Báo cáo chi tiết</h4>
            <div
              className="report-content-html"
              dangerouslySetInnerHTML={{ __html: reportData.detailedReport }}
            />
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default LeaderReportModal;
