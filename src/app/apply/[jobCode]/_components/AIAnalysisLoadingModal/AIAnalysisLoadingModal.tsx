import { Modal } from "antd";
import React, { useEffect, useState } from "react";
import { FaChartLine, FaFileAlt, FaLightbulb, FaRobot } from "react-icons/fa";
import { BiTimer } from "react-icons/bi";
import "./AIAnalysisLoadingModal.scss";

interface AIAnalysisLoadingModalProps {
  isOpen: boolean;
  loadingStep: number;
}

const funQuestions = [
  "💡 Bạn có biết: AI có thể phân tích hơn 1000 CV chỉ trong vài phút?",
  "🎯 Fun Fact: Kỹ năng mềm quan trọng không kém kỹ năng chuyên môn!",
  "🚀 Tip: CV ngắn gọn, súc tích thường được đánh giá cao hơn!",
  "✨ Thú vị: 75% nhà tuyển dụng dành dưới 1 phút để đọc một CV!",
  "🎨 Lưu ý: Thiết kế CV đẹp mắt giúp tăng 40% cơ hội được chú ý!",
  "📊 Biết chưa: Keywords phù hợp giúp CV của bạn vượt qua AI screening!",
  "🎓 Fun Fact: Học vấn quan trọng nhưng kinh nghiệm mới là chìa khóa!",
  "💼 Tip: Đề cập con số cụ thể trong CV giúp tăng độ uy tín!",
  "🌟 Thú vị: Video CV đang trở thành xu hướng mới trong tuyển dụng!",
  "🔍 Lưu ý: Lỗi chính tả có thể khiến CV bạn bị loại ngay lập tức!",
];

const AIAnalysisLoadingModal: React.FC<AIAnalysisLoadingModalProps> = ({
  isOpen,
  loadingStep,
}) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);

  useEffect(() => {
    if (isOpen) {
      const interval = setInterval(() => {
        setCurrentQuestion((prev) => (prev + 1) % funQuestions.length);
      }, 4000); // Thay đổi câu hỏi mỗi 4 giây

      return () => clearInterval(interval);
    }
  }, [isOpen]);

  return (
    <Modal
      open={isOpen}
      footer={null}
      closable={false}
      centered
      width={950}
      className="ai-analysis-loading-modal"
    >
      <div className="ai-loading-content">
        {/* Holographic Grid Background */}
        <div className="holographic-grid">
          <div className="grid-line horizontal"></div>
          <div className="grid-line horizontal"></div>
          <div className="grid-line horizontal"></div>
          <div className="grid-line vertical"></div>
          <div className="grid-line vertical"></div>
          <div className="grid-line vertical"></div>
        </div>

        {/* Animated Particles Background */}
        <div className="particles-bg">
          {[...Array(40)].map((_, i) => (
            <div
              key={i}
              className="particle"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${3 + Math.random() * 4}s`,
              }}
            ></div>
          ))}
        </div>

        {/* AI Brain Animation */}
        <div className="ai-brain-animation">
          <div className="brain-container">
            <div className="brain-glow"></div>
            <div className="holographic-ring ring-1"></div>
            <div className="holographic-ring ring-2"></div>
            <div className="holographic-ring ring-3"></div>
            <FaRobot className="brain-icon" />
            <div className="neural-network">
              <div className="neuron n1"></div>
              <div className="neuron n2"></div>
              <div className="neuron n3"></div>
              <div className="neuron n4"></div>
              <div className="neuron n5"></div>
              <div className="neuron n6"></div>
              <div className="connection c1"></div>
              <div className="connection c2"></div>
              <div className="connection c3"></div>
              <div className="connection c4"></div>
            </div>
          </div>
        </div>

        <h2 className="ai-loading-title">
          <FaChartLine className="chart-icon" />
          <span>AI Đang Phân Tích CV Của Bạn</span>
        </h2>

        {/* Time Estimation Notice */}
        <div className="time-estimation-notice">
          <BiTimer className="timer-icon" />
          <span className="time-text">
            Dự kiến: <strong>30 giây - 1 phút</strong>
          </span>
        </div>

        <div className="loading-progress-text">
          {loadingStep === 0 && (
            <p className="step-text fade-in">
              <span className="step-icon">🔍</span>
              Đang đọc và trích xuất thông tin từ CV...
            </p>
          )}
          {loadingStep === 1 && (
            <p className="step-text fade-in">
              <span className="step-icon">🧠</span>
              Phân tích kỹ năng và kinh nghiệm...
            </p>
          )}
          {loadingStep === 2 && (
            <p className="step-text fade-in">
              <span className="step-icon">📊</span>
              So sánh với yêu cầu công việc...
            </p>
          )}
          {loadingStep === 3 && (
            <p className="step-text fade-in">
              <span className="step-icon">✨</span>
              Hoàn tất và tổng hợp kết quả...
            </p>
          )}
        </div>

        {/* Fun Questions Section */}
        <div className="fun-questions-section">
          <div className="question-container">
            <div key={currentQuestion} className="question-text fade-slide-in">
              {funQuestions[currentQuestion]}
            </div>
          </div>
        </div>

        <div className="modern-progress">
          <div className="progress-bar-container">
            <div
              className="progress-bar-fill"
              style={{
                width: `${(loadingStep / 3) * 100}%`,
              }}
            >
              <div className="progress-shimmer"></div>
              <div className="progress-glow"></div>
            </div>
            <div className="progress-particles">
              {[...Array(8)].map((_, i) => (
                <div
                  key={i}
                  className="progress-particle"
                  style={{
                    animationDelay: `${i * 0.2}s`,
                  }}
                ></div>
              ))}
            </div>
          </div>
          <div className="progress-percentage">
            <span className="percentage-number">
              {Math.round((loadingStep / 3) * 100)}%
            </span>
            <span className="percentage-label">Hoàn thành</span>
          </div>
        </div>

        <div className="loading-stats">
          <div className={`stat-item ${loadingStep >= 0 ? "active" : ""}`}>
            <div className="stat-icon-wrapper">
              <FaFileAlt className="stat-icon" />
              <div className="icon-glow"></div>
            </div>
            <span>CV Upload</span>
          </div>
          <div className="stat-arrow">
            <div className="arrow-line"></div>
            <div className="arrow-head">→</div>
          </div>
          <div className={`stat-item ${loadingStep >= 1 ? "active" : ""}`}>
            <div className="stat-icon-wrapper">
              <FaChartLine className="stat-icon" />
              <div className="icon-glow"></div>
            </div>
            <span>AI Analysis</span>
          </div>
          <div className="stat-arrow">
            <div className="arrow-line"></div>
            <div className="arrow-head">→</div>
          </div>
          <div className={`stat-item ${loadingStep >= 3 ? "active" : ""}`}>
            <div className="stat-icon-wrapper">
              <FaLightbulb className="stat-icon" />
              <div className="icon-glow"></div>
            </div>
            <span>Results</span>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default AIAnalysisLoadingModal;
