import React, { useEffect, useState } from "react";
import { MdSystemSecurityUpdateGood } from "react-icons/md";

interface OTPModalProps {
  showOTPModal: boolean;
  otpValue: string;
  setOtpValue: (value: string) => void;
  isVerifying: boolean;
  handleOTPSubmit: () => Promise<void>;
  handleCloseOTPModal: () => void;
  handleResendOTP: () => Promise<void>;
  initialSeconds?: number;
}

const OTPModal: React.FC<OTPModalProps> = ({
  showOTPModal,
  otpValue,
  setOtpValue,
  isVerifying,
  handleOTPSubmit,
  handleCloseOTPModal,
  handleResendOTP,
  initialSeconds = 60,
}) => {
  const [secondsLeft, setSecondsLeft] = useState<number>(initialSeconds);

  // Start or reset countdown whenever modal opens or initialSeconds changes
  useEffect(() => {
    if (!showOTPModal) return;
    setSecondsLeft(initialSeconds);
  }, [showOTPModal, initialSeconds]);

  // Countdown effect
  useEffect(() => {
    if (!showOTPModal) return;
    if (secondsLeft <= 0) return;
    const timer = setInterval(() => {
      setSecondsLeft((s) => {
        if (s <= 1) {
          clearInterval(timer);
          return 0;
        }
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [showOTPModal, secondsLeft]);

  if (!showOTPModal) return null;

  const onResendClick = async () => {
    // Prevent spamming resend while timer running
    if (secondsLeft > 0) return;
    setSecondsLeft(initialSeconds);
    try {
      await handleResendOTP();
    } catch (error) {
      void error;
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h3>Xác thực chữ ký</h3>
          <button onClick={handleCloseOTPModal} className="close-button">
            ×
          </button>
        </div>
        <div className="modal-body">
          <div className="otp-icon">
            <div className="security-icon">
              <MdSystemSecurityUpdateGood size={65} />
            </div>
          </div>
          <h4>Xác thực bảo mật</h4>
          <p>
            Chúng tôi đã gửi mã OTP 6 chữ số đến thiết bị của bạn. Vui lòng nhập
            mã để xác thực chữ ký:
          </p>

          <div className="otp-input-container">
            {[0, 1, 2, 3, 4, 5].map((index) => (
              <input
                key={index}
                type="text"
                value={otpValue[index] || ""}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, "");
                  if (value.length <= 1) {
                    const newOtp = otpValue.split("");
                    newOtp[index] = value;
                    const finalOtp = newOtp.join("").slice(0, 6);
                    setOtpValue(finalOtp);

                    // Auto focus next input
                    if (value && index < 5) {
                      const nextInput = document.querySelector(
                        `input[data-index="${index + 1}"]`
                      ) as HTMLInputElement;
                      nextInput?.focus();
                    }
                  }
                }}
                onKeyDown={(e) => {
                  if (e.key === "Backspace" && !otpValue[index] && index > 0) {
                    const prevInput = document.querySelector(
                      `input[data-index="${index - 1}"]`
                    ) as HTMLInputElement;
                    prevInput?.focus();
                  }
                }}
                onPaste={(e) => {
                  e.preventDefault();
                  const pasteData = e.clipboardData
                    .getData("text")
                    .replace(/\D/g, "")
                    .slice(0, 6);
                  setOtpValue(pasteData);

                  // Focus the last filled input or first empty one
                  const targetIndex = Math.min(pasteData.length - 1, 5);
                  const targetInput = document.querySelector(
                    `input[data-index="${targetIndex}"]`
                  ) as HTMLInputElement;
                  targetInput?.focus();
                }}
                className="otp-digit"
                maxLength={1}
                data-index={index}
                disabled={isVerifying}
              />
            ))}
          </div>

          <div className="otp-info">
            <small>
              {!secondsLeft ? (
                <>
                  Không nhận được mã?{" "}
                  <button
                    type="button"
                    className={`resend-link`}
                    onClick={onResendClick}
                  >
                    Gửi lại
                  </button>
                </>
              ) : (
                <>
                  Mã còn: <strong>{secondsLeft}s</strong>
                </>
              )}
            </small>
          </div>

          <div className="modal-actions">
            <button
              onClick={handleCloseOTPModal}
              className="cancel-button"
              disabled={isVerifying}
            >
              Hủy
            </button>
            <button
              onClick={handleOTPSubmit}
              className="submit-button"
              disabled={isVerifying || otpValue.length !== 6}
            >
              {isVerifying ? (
                <>
                  <span className="loading-spinner"></span>
                  Đang xác thực...
                </>
              ) : (
                <>
                  <span className="verify-icon">✓</span>
                  Xác thực
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OTPModal;
