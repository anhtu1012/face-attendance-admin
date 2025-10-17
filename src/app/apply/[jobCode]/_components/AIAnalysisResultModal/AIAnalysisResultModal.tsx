import { AnalysisResult } from "@/types/AnalysisResult";
import { Button, Col, Modal, Progress, Row, Tabs, Tooltip } from "antd";
import React, { useEffect, useState } from "react";
import {
  FaCheck,
  FaCheckCircle,
  FaExclamationCircle,
  FaLightbulb,
  FaMedal,
  FaRobot,
  FaStar,
  FaThumbsUp,
  FaTrophy,
} from "react-icons/fa";
import "./AIAnalysisResultModal.scss";

interface AIAnalysisResultModalProps {
  isOpen: boolean;
  onClose: () => void;
  analysisResult: AnalysisResult | null;
}

const AIAnalysisResultModal: React.FC<AIAnalysisResultModalProps> = ({
  isOpen,
  onClose,
  analysisResult,
}) => {
  const [animatedScore, setAnimatedScore] = useState(0);

  // Animate score when modal opens
  useEffect(() => {
    if (isOpen && analysisResult) {
      let start = 0;
      const end = analysisResult.matchScore;
      const duration = 1500;
      const increment = 20;
      const steps = Math.ceil(duration / increment);
      const step = end / steps;

      const timer = setInterval(() => {
        start += step;
        if (start >= end) {
          setAnimatedScore(end);
          clearInterval(timer);
        } else {
          setAnimatedScore(Math.floor(start));
        }
      }, increment);

      return () => clearInterval(timer);
    }
  }, [isOpen, analysisResult]);

  if (!analysisResult) return null;

  // Helper function to get recommendation badge props
  const getRecommendationBadge = () => {
    const { recommendation } = analysisResult;
    switch (recommendation) {
      case "Strongly Recommend":
        return {
          icon: <FaTrophy />,
          className: "strongly-recommend",
          text: "Khuyến nghị mạnh mẽ",
        };
      case "Recommend":
        return {
          icon: <FaMedal />,
          className: "recommend",
          text: "Khuyến nghị",
        };
      case "Consider":
        return {
          icon: <FaLightbulb />,
          className: "consider",
          text: "Cân nhắc",
        };
      default:
        return {
          icon: <FaExclamationCircle />,
          className: "not-a-good-fit",
          text: "Không phù hợp",
        };
    }
  };

  const recommendationBadge = getRecommendationBadge();

  return (
    <Modal
      open={isOpen}
      onCancel={onClose}
      footer={null}
      centered
      width={1050}
      className="ai-analysis-result-modal"
      closeIcon={null}
    >
      <div className="ai-result-content">
        {/* Modern Header with Glow Effect */}
        <div className="result-header-modern">
          <div className="header-glow"></div>
          <div className="header-content">
            <div className="robot-container">
              <FaRobot className="header-icon-modern" />
              <div className="pulse-circle"></div>
            </div>
            <div className="header-info">
              <h3>Kết Quả Phân Tích AI</h3>
              <span className="header-subtitle">
                Đánh giá tự động dựa trên CV và yêu cầu công việc
              </span>
            </div>
            <div className="recommendation-badge-container">
              <Tooltip title={analysisResult.recommendation}>
                <div className={`rec-badge ${recommendationBadge.className}`}>
                  {recommendationBadge.icon} {recommendationBadge.text}
                </div>
              </Tooltip>
            </div>
          </div>
        </div>

        {/* Enhanced Score and Summary in one row */}

        {/* Enhanced Tabs Section */}
        <div className="enhanced-tabs-container">
          <Tabs
            defaultActiveKey="summary"
            className="result-tabs"
            items={[
              {
                key: "summary",
                label: (
                  <span className="tab-label">
                    <FaLightbulb className="tab-icon" />
                    <span className="tab-text">Tóm tắt</span>
                  </span>
                ),
                children: (
                  <Row>
                    {" "}
                    <Col span={6}>
                      <div className="score-summary-row full-width">
                        <div className="score-section">
                          <div className="score-card">
                            <div className="score-rings">
                              <div className="ring ring-1"></div>
                              <div className="ring ring-2"></div>
                            </div>
                            <Progress
                              type="circle"
                              percent={animatedScore}
                              strokeColor={{
                                "0%": "rgb(13, 71, 161)",
                                "100%": "rgb(30, 136, 229)",
                              }}
                              strokeWidth={10}
                              width={140}
                              format={(percent) => (
                                <div className="score-display">
                                  <span className="score-num">{percent}%</span>
                                  <span className="score-text">Phù hợp</span>
                                </div>
                              )}
                            />
                          </div>
                        </div>

                        {/* Score section expanded to full width */}
                      </div>
                    </Col>
                    <Col span={18}>
                      <div className="tab-panel summary-panel">
                        <div className="summary-content-wrapper">
                          <p className="summary-content-tab">
                            {analysisResult.summary}
                          </p>
                        </div>
                      </div>
                    </Col>
                  </Row>
                ),
              },
              {
                key: "strengths",
                label: (
                  <span className="tab-label">
                    <FaThumbsUp className="tab-icon" />
                    <span className="tab-text">Điểm mạnh</span>
                  </span>
                ),
                children: (
                  <div className="tab-panel strengths-panel">
                    <ul className="points-list">
                      {analysisResult.strengths.map((strength, index) => (
                        <li
                          key={index}
                          className="point-item success"
                          style={{ animationDelay: `${index * 0.1}s` }}
                        >
                          <div className="point-card-glow"></div>
                          <div className="point-content">
                            <div className="point-number">{index + 1}</div>
                            <FaCheckCircle className="point-icon" />
                            <span className="point-text">{strength}</span>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                ),
              },
              {
                key: "weaknesses",
                label: (
                  <span className="tab-label">
                    <FaExclamationCircle className="tab-icon" />
                    <span className="tab-text">Cần cải thiện</span>
                  </span>
                ),
                children: (
                  <div className="tab-panel weaknesses-panel">
                    <ul className="points-list">
                      {analysisResult.weaknesses.map((weakness, index) => (
                        <li
                          key={index}
                          className="point-item warning"
                          style={{ animationDelay: `${index * 0.1}s` }}
                        >
                          <div className="point-card-glow warning-glow"></div>
                          <div className="point-content">
                            <div className="point-number warning">
                              {index + 1}
                            </div>
                            <FaExclamationCircle className="point-icon" />
                            <span className="point-text">{weakness}</span>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                ),
              },
            ]}
          />
        </div>

        {/* Compact Footer */}
        <div className="result-footer-message">
          <div className="footer-particle-container">
            <div className="footer-particles"></div>
          </div>
          <div className="footer-icon">
            <FaStar className="star-icon" />
            <div className="star-glow"></div>
          </div>
          <div className="footer-content">
            <h4>Cảm ơn bạn đã ứng tuyển!</h4>
            <p>
              Chúng tôi đánh giá cao sự quan tâm của bạn. Kết quả phân tích trên
              chỉ mang tính tham khảo. Hồ sơ của bạn sẽ luôn được đội ngũ HR xem
              xét kỹ lưỡng và đánh giá toàn diện. Chúng tôi sẽ liên hệ với bạn
              sớm nhất!
            </p>
          </div>
          <Button
            type="primary"
            onClick={onClose}
            className="ok-button"
            size="large"
            icon={<FaCheck />}
          >
            OK
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default AIAnalysisResultModal;
