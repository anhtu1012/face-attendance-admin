import { Button, Col, Image, Modal, Row } from "antd";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import {
  AiOutlineClockCircle,
  AiOutlineFileText,
  AiOutlineUser,
} from "react-icons/ai";
import {
  BsCalendar2Check,
  BsCheckCircleFill,
  BsHourglassSplit,
  BsXCircleFill,
} from "react-icons/bs";
import { MdAttachFile } from "react-icons/md";

import { ApplicationItem } from "@/dtos/tac-vu-nhan-su/quan-ly-don-tu/application.dto";
import "./ApplicationDetailModal.scss";

interface ApplicationDetailModalProps {
  open: boolean;
  onClose: () => void;
  application: ApplicationItem | null;
  onApprove: (id: string, response: string, status: "ACCEPTED") => void;
  onReject: (id: string, response: string, status: "REJECTED") => void;
  onRefresh: () => void;
  processing?: boolean;
}

const ApplicationDetailModal: React.FC<ApplicationDetailModalProps> = ({
  open,
  onClose,
  application,
  onApprove,
  onReject,
  processing = false,
}) => {
  const [response, setResponse] = useState("");
  const [showResponseInput, setShowResponseInput] = useState(false);
  const [actionType, setActionType] = useState<"approve" | "reject" | null>(
    null
  );

  useEffect(() => {
    if (open && application) {
      setShowResponseInput(false);
      setActionType(null);
      setResponse("");
    }
  }, [open, application]);

  const handleApproveClick = () => {
    setActionType("approve");
    setShowResponseInput(true);
  };

  const handleRejectClick = () => {
    setActionType("reject");
    setShowResponseInput(true);
  };

  const handleConfirmAction = () => {
    if (!application || !actionType) return;
    if (actionType === "approve") {
      onApprove(application.id, response, "ACCEPTED");
    } else {
      onReject(application.id, response, "REJECTED");
    }
  };

  const handleCancelAction = () => {
    setShowResponseInput(false);
    setActionType(null);
    setResponse(application?.response || "");
  };

  const getStatusInfo = (status: string) => {
    const statusMap = {
      PENDING: {
        class: "pending",
        label: "Chờ duyệt",
        icon: <BsHourglassSplit />,
      },
      ACCEPTED: {
        class: "approved",
        label: "Đã duyệt",
        icon: <BsCheckCircleFill />,
      },
      REJECTED: {
        class: "rejected",
        label: "Từ chối",
        icon: <BsXCircleFill />,
      },
      CANCELLED: {
        class: "cancelled",
        label: "Đã hủy",
        icon: <BsXCircleFill />,
      },
    };
    return (
      statusMap[status as keyof typeof statusMap] || {
        class: "pending",
        label: status,
        icon: <BsHourglassSplit />,
      }
    );
  };

  // const formatDuration = (startTime: string, endTime: string) => {
  //   const start = dayjs(startTime);
  //   const end = dayjs(endTime);
  //   const days = end.diff(start, "day");
  //   const hours = end.diff(start, "hour") % 24;
  //   if (days > 0)
  //     return hours > 0 ? `${days} ngày ${hours} giờ` : `${days} ngày`;
  //   return `${hours} giờ`;
  // };

  return (
    <Modal
      open={open}
      onCancel={onClose}
      title={null}
      width={1000}
      footer={null}
      className="application-detail-modal-modern"
      destroyOnHidden
      closeIcon={null}
    >
      {application && (
        <div className="modern-detail-content">
          {/* Header với Status */}
          <div className="modal-header">
            <div className="header-left">
              <div className="application-type">
                <AiOutlineFileText className="type-icon" />
                <span>{application.formCategoryTitle}</span>
              </div>
              <div className="application-id">Mã đơn: #{application.id}</div>
            </div>
            <div className="header-right">
              <div
                className={`status-badge-large ${
                  getStatusInfo(application.status).class
                }`}
              >
                <span className="status-icon">
                  {getStatusInfo(application.status).icon}
                </span>
                <span className="status-text">
                  {getStatusInfo(application.status).label}
                </span>
              </div>
            </div>
          </div>

          {/* Main Content Grid */}
          <div className="content-grid">
            <Row gutter={[20, 20]}>
              {/* Submitter Card */}
              <Col xs={24} md={12}>
                <div className="info-card submitter-card">
                  <div className="card-icon">
                    <AiOutlineUser />
                  </div>
                  <div className="card-content">
                    <div className="card-label">Người nộp đơn</div>
                    <div className="card-value-large">
                      {application.submittedName}
                    </div>
                    <div className="card-meta">
                      <AiOutlineClockCircle />
                      <span>
                        {dayjs(application.createdAt).format(
                          "DD/MM/YYYY HH:mm"
                        )}
                      </span>
                    </div>
                  </div>
                </div>
              </Col>

              {/* Time Period Card */}
              <Col xs={24} md={12}>
                <div className="info-card time-card">
                  <div className="card-icon">
                    <BsCalendar2Check />
                  </div>
                  <div className="card-content">
                    <div className="card-label">Thời gian yêu cầu</div>
                    <div className="time-range">
                      <div className="time-item">
                        <span className="time-label">Từ</span>
                        <span className="time-value">
                          {dayjs(application.startTime).format(
                            "DD/MM/YYYY HH:mm"
                          )}
                        </span>
                      </div>
                      <div className="time-arrow">→</div>
                      <div className="time-item">
                        <span className="time-label">Đến</span>
                        <span className="time-value">
                          {dayjs(application.endTime).format(
                            "DD/MM/YYYY HH:mm"
                          )}
                        </span>
                      </div>
                    </div>
                    {/* <div className="duration-badge">
                      <BsHourglassSplit />
                      <span>
                        Thời lượng:{" "}
                        {formatDuration(
                          application.startTime,
                          application.endTime
                        )}
                      </span>
                    </div> */}
                  </div>
                </div>
              </Col>

              {/* Approval Info - Full width */}
              {application.approvedName && (
                <Col xs={24}>
                  <div className="info-card approval-card">
                    <div className="card-icon">
                      {application.status === "ACCEPTED" ? (
                        <BsCheckCircleFill />
                      ) : (
                        <BsXCircleFill />
                      )}
                    </div>
                    <div className="card-content">
                      <div className="card-label">Thông tin duyệt</div>
                      <div className="approval-info">
                        <div className="approval-item">
                          <span className="approval-label">Người duyệt</span>
                          <span className="approval-value">
                            {application.approvedName}
                          </span>
                        </div>
                        <div className="approval-item">
                          <span className="approval-label">Thời gian</span>
                          <span className="approval-value">
                            {dayjs(application.approvedTime).format(
                              "DD/MM/YYYY HH:mm"
                            )}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </Col>
              )}

              {/* Reason Card - Full width */}
              <Col xs={24}>
                <div className="info-card reason-card">
                  <div className="card-icon">
                    <AiOutlineFileText />
                  </div>
                  <div className="card-content">
                    <div className="card-label">Lý do</div>
                    <div className="reason-content">{application.reason}</div>
                  </div>
                </div>
              </Col>

              {/* Response Card - Full width */}
              {(application.status !== "PENDING" ||
                showResponseInput ||
                application.response) && (
                <Col xs={24}>
                  <div className="info-card response-card">
                    <div className="card-icon">💬</div>
                    <div className="card-content">
                      <div className="card-label">
                        {showResponseInput
                          ? "Nhập phản hồi của bạn"
                          : "Phản hồi"}
                      </div>
                      {showResponseInput ? (
                        <textarea
                          className="response-input"
                          value={response}
                          onChange={(e) => setResponse(e.target.value)}
                          placeholder={
                            actionType === "approve"
                              ? "Nhập lý do duyệt đơn này (bắt buộc)..."
                              : "Nhập lý do từ chối đơn này (bắt buộc)..."
                          }
                          autoFocus
                          rows={4}
                        />
                      ) : (
                        <div className="response-text">
                          {application.response || "Chưa có phản hồi"}
                        </div>
                      )}
                    </div>
                  </div>
                </Col>
              )}

              {/* Files Card - Full width */}
              {application.file && application.file.length > 0 && (
                <Col xs={24}>
                  <div className="info-card files-card">
                    <div className="card-icon">
                      <MdAttachFile />
                    </div>
                    <div className="card-content">
                      <div className="card-label">
                        Tài liệu đính kèm ({application.file.length})
                      </div>
                      <Image.PreviewGroup>
                        <div className="files-grid">
                          {application.file.map((file, index) => (
                            <div key={index} className="file-item">
                              <Image
                                src={file}
                                alt={`File ${index + 1}`}
                                className="file-image"
                              />
                              <div className="file-number">{index + 1}</div>
                            </div>
                          ))}
                        </div>
                      </Image.PreviewGroup>
                    </div>
                  </div>
                </Col>
              )}
            </Row>
          </div>

          {/* Footer Actions */}
          <div className="modal-footer">
            {showResponseInput ? (
              <>
                <Button
                  className="btn-cancel"
                  size="large"
                  onClick={handleCancelAction}
                  disabled={processing}
                >
                  Hủy
                </Button>
                <Button
                  className={
                    actionType === "approve" ? "btn-approve" : "btn-reject"
                  }
                  size="large"
                  onClick={handleConfirmAction}
                  loading={processing}
                >
                  {actionType === "approve"
                    ? "Xác nhận duyệt"
                    : "Xác nhận từ chối"}
                </Button>
              </>
            ) : application.status === "PENDING" ? (
              <>
                <Button className="btn-cancel" size="large" onClick={onClose}>
                  Đóng
                </Button>
                <Button
                  className="btn-reject"
                  size="large"
                  onClick={handleRejectClick}
                  disabled={processing}
                >
                  Từ chối
                </Button>
                <Button
                  className="btn-approve"
                  size="large"
                  onClick={handleApproveClick}
                  disabled={processing}
                >
                  Duyệt đơn
                </Button>
              </>
            ) : (
              <Button className="btn-cancel" size="large" onClick={onClose}>
                Đóng
              </Button>
            )}
          </div>
        </div>
      )}
    </Modal>
  );
};

export default ApplicationDetailModal;
