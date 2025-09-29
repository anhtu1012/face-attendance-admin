import React from "react";
import { Modal, Button, Result } from "antd";
import { FaExternalLinkAlt, FaCopy, FaCheck } from "react-icons/fa";
import "./SuccessModal.scss";

interface SuccessModalProps {
  open: boolean;
  onClose: () => void;
  jobLink: string;
}

const SuccessModal: React.FC<SuccessModalProps> = ({
  open,
  onClose,
  jobLink,
}) => {
  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(jobLink);
      // You might want to show a toast message here
    } catch (error) {
      console.error("Failed to copy link:", error);
    }
  };

  const handleOpenLink = () => {
    window.open(jobLink, "_blank");
  };

  return (
    <Modal
      open={open}
      onCancel={onClose}
      footer={null}
      width={500}
      className="success-modal"
      maskClosable={false}
      centered
    >
      <Result
        icon={
          <div className="success-icon">
            <FaCheck />
          </div>
        }
        title={<div className="success-title">Tạo công việc thành công!</div>}
        subTitle={
          <div className="success-subtitle">
            Công việc đã được tạo và đăng tải. Bạn có thể xem và chia sẻ link
            công việc bên dưới.
          </div>
        }
        extra={
          <div className="success-actions">
            <div className="link-display">
              <input
                type="text"
                value={jobLink}
                readOnly
                className="link-input"
              />
              <Button
                icon={<FaCopy />}
                onClick={handleCopyLink}
                className="copy-btn"
                title="Sao chép link"
              />
            </div>
            <div className="action-buttons">
              <Button onClick={onClose} className="close-btn" size="large">
                Đóng
              </Button>
              <Button
                type="primary"
                icon={<FaExternalLinkAlt />}
                onClick={handleOpenLink}
                className="open-btn"
                size="large"
              >
                Mở link
              </Button>
            </div>
          </div>
        }
      />
    </Modal>
  );
};

export default SuccessModal;
