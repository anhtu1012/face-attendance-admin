import { Button, Image, message, Modal, Spin } from "antd";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { ApplicationItem } from "../../_types/prop";
import { mockApplications } from "../../_services/mockData";
import {
  AiOutlineClockCircle,
  AiOutlineFileText,
  AiOutlineUser,
} from "react-icons/ai";
import {
  BsCheckCircleFill,
  BsXCircleFill,
  BsCalendar2Check,
  BsHourglassSplit,
} from "react-icons/bs";
import { MdAttachFile } from "react-icons/md";
import "./ApplicationDetailModal.scss";

interface ApplicationDetailModalProps {
  open: boolean;
  onClose: () => void;
  applicationId: string | null;
  onApprove: (id: string, response: string) => void;
  onReject: (id: string, response: string) => void;
  onRefresh: () => void;
}

const ApplicationDetailModal: React.FC<ApplicationDetailModalProps> = ({
  open,
  onClose,
  applicationId,
  onApprove,
  onReject,
  onRefresh,
}) => {
  const [application, setApplication] = useState<ApplicationItem | null>(null);
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState("");
  const [showResponseInput, setShowResponseInput] = useState(false);
  const [actionType, setActionType] = useState<"approve" | "reject" | null>(
    null
  );

  useEffect(() => {
    if (open && applicationId) {
      fetchApplicationDetail();
      setShowResponseInput(false);
      setActionType(null);
      setResponse("");
    }
  }, [open, applicationId]);

  const fetchApplicationDetail = async () => {
    setLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 300));
      const found = mockApplications.find((app) => app.id === applicationId);
      if (found) {
        setApplication(found);
        setResponse(found.response || "");
      }
    } catch (error) {
      console.log(error);

      message.error("Có lỗi xảy ra khi tải thông tin đơn");
    } finally {
      setLoading(false);
    }
  };

  const handleApproveClick = () => {
    setActionType("approve");
    setShowResponseInput(true);
  };

  const handleRejectClick = () => {
    setActionType("reject");
    setShowResponseInput(true);
  };

  const handleConfirmAction = () => {
    if (!applicationId || !actionType) return;
    if (!response.trim()) {
      message.warning("Vui lòng nhập phản hồi");
      return;
    }

    Modal.confirm({
      title:
        actionType === "approve"
          ? "Xác nhận duyệt đơn"
          : "Xác nhận từ chối đơn",
      content:
        actionType === "approve"
          ? "Bạn có chắc chắn muốn duyệt đơn này?"
          : "Bạn có chắc chắn muốn từ chối đơn này?",
      okText: actionType === "approve" ? "Duyệt" : "Từ chối",
      cancelText: "Hủy",
      okButtonProps: { danger: actionType === "reject" },
      onOk: () => {
        if (actionType === "approve") {
          onApprove(applicationId, response);
        } else {
          onReject(applicationId, response);
        }
        onRefresh();
        onClose();
      },
    });
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
      APPROVED: {
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
      destroyOnClose
      closeIcon={null}
    >
      {loading ? (
        <div style={{ textAlign: "center", padding: "60px 0" }}>
          <Spin size="large" />
        </div>
      ) : (
        application && (
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
              {/* Left Column - Main Info */}
              <div className="left-column">
                {/* Submitter Card */}
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

                {/* Time Period Card */}
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

                {/* Reason Card */}
                <div className="info-card reason-card">
                  <div className="card-icon">
                    <AiOutlineFileText />
                  </div>
                  <div className="card-content">
                    <div className="card-label">Lý do</div>
                    {application.reason}
                  </div>
                </div>
              </div>

              {/* Right Column - Additional Info */}
              <div className="right-column">
                {/* Approval Info */}
                {application.approvedName && (
                  <div className="info-card approval-card">
                    <div className="card-icon">
                      {application.status === "APPROVED" ? (
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
                )}

                {/* Response Card */}
                {(application.status !== "PENDING" ||
                  showResponseInput ||
                  application.response) && (
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
                )}

                {/* Files Card */}
                {application.files && application.files.length > 0 && (
                  <div className="info-card files-card">
                    <div className="card-icon">
                      <MdAttachFile />
                    </div>
                    <div className="card-content">
                      <div className="card-label">
                        Tài liệu đính kèm ({application.files.length})
                      </div>
                      <Image.PreviewGroup>
                        <div className="files-grid">
                          {application.files.map((file, index) => (
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
                )}
              </div>
            </div>

            {/* Footer Actions */}
            <div className="modal-footer">
              {showResponseInput ? (
                <>
                  <Button
                    className="btn-cancel"
                    size="large"
                    onClick={handleCancelAction}
                  >
                    Hủy
                  </Button>
                  <Button
                    className={
                      actionType === "approve" ? "btn-approve" : "btn-reject"
                    }
                    size="large"
                    onClick={handleConfirmAction}
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
                  >
                    Từ chối
                  </Button>
                  <Button
                    className="btn-approve"
                    size="large"
                    onClick={handleApproveClick}
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
        )
      )}
    </Modal>
  );
};

export default ApplicationDetailModal;
