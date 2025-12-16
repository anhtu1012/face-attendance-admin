"use client";

import {
  CalendarOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  CloseCircleOutlined,
  EyeOutlined,
  FileTextOutlined,
  HourglassOutlined,
  MinusCircleOutlined,
  PaperClipOutlined,
  StopOutlined,
} from "@ant-design/icons";
import {
  Badge,
  Button,
  Card,
  Col,
  Empty,
  Image,
  Modal,
  Row,
  Spin,
  Tag,
  Timeline,
} from "antd";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import "./UserFormsTab.scss";
import QuanLyDonTuServices from "@/services/tac-vu-nhan-su/quan-ly-don-tu/quan-ly-don-tu.service";
import { ApplicationItem } from "@/dtos/tac-vu-nhan-su/quan-ly-don-tu/application.dto";

interface UserFormsTabProps {
  userId: string;
}

const statusConfig = {
  ACCEPTED: {
    color: "#52c41a",
    icon: <CheckCircleOutlined />,
    text: "Đã duyệt",
    bgColor: "rgba(82, 196, 26)",
  },
  REJECTED: {
    color: "#ff4d4f",
    icon: <CloseCircleOutlined />,
    text: "Từ chối",
    bgColor: "rgba(255, 77, 79)",
  },
  PENDING: {
    color: "#faad14",
    icon: <HourglassOutlined />,
    text: "Chờ duyệt",
    bgColor: "rgba(250, 173, 20)",
  },
  CANCELLED: {
    color: "#8c8c8c",
    icon: <MinusCircleOutlined />,
    text: "Đã hủy",
    bgColor: "rgba(140, 140, 140)",
  },
  INACTIVE: {
    color: "#d9d9d9",
    icon: <StopOutlined />,
    text: "Không hoạt động",
    bgColor: "rgba(217, 217, 217)",
  },
};

function UserFormsTab({ userId }: UserFormsTabProps) {
  const [loading, setLoading] = useState(false);
  const [formsData, setFormsData] = useState<ApplicationItem[]>([]);
  const [selectedForm, setSelectedForm] = useState<ApplicationItem | null>(
    null
  );
  const [detailModalVisible, setDetailModalVisible] = useState(false);

  useEffect(() => {
    fetchFormsData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  const fetchFormsData = async () => {
    setLoading(true);
    try {
      const response = await QuanLyDonTuServices.getDanhSachDonNguoiGui(
        [],
        undefined,
        {
          submitterId: userId,
        }
      );
      setFormsData(response.data || []);
    } catch (error) {
      console.error("Error fetching forms data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetail = (form: ApplicationItem) => {
    setSelectedForm(form);
    setDetailModalVisible(true);
  };

  const getStatusStats = () => {
    const stats = {
      total: formsData.length,
      accepted: formsData.filter((f) => f.status === "ACCEPTED").length,
      rejected: formsData.filter((f) => f.status === "REJECTED").length,
      pending: formsData.filter((f) => f.status === "PENDING").length,
    };
    return stats;
  };

  const stats = getStatusStats();

  if (loading) {
    return (
      <div className="forms-loading">
        <Spin size="large" tip="Đang tải dữ liệu đơn từ..." />
      </div>
    );
  }

  return (
    <div className="user-forms-tab">
      {/* Statistics Cards */}
      <Row gutter={[24, 24]} className="stats-cards">
        <Col xs={24} sm={12} lg={6}>
          <Card className="stat-card total-card">
            <div className="stat-icon">
              <FileTextOutlined />
            </div>
            <div className="stat-content">
              <div className="stat-value">{stats.total}</div>
              <div className="stat-label">Tổng đơn từ</div>
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card className="stat-card accepted-card">
            <div className="stat-icon">
              <CheckCircleOutlined />
            </div>
            <div className="stat-content">
              <div className="stat-value">{stats.accepted}</div>
              <div className="stat-label">Đã duyệt</div>
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card className="stat-card pending-card">
            <div className="stat-icon">
              <HourglassOutlined />
            </div>
            <div className="stat-content">
              <div className="stat-value">{stats.pending}</div>
              <div className="stat-label">Chờ duyệt</div>
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card className="stat-card rejected-card">
            <div className="stat-icon">
              <CloseCircleOutlined />
            </div>
            <div className="stat-content">
              <div className="stat-value">{stats.rejected}</div>
              <div className="stat-label">Từ chối</div>
            </div>
          </Card>
        </Col>
      </Row>

      {/* Forms Timeline */}
      <Card className="forms-timeline-card">
        <div className="card-header">
          <div className="header-left">
            <FileTextOutlined className="header-icon" />
            <div>
              <h3>Lịch sử đơn từ</h3>
              <p>Danh sách các đơn từ đã gửi</p>
            </div>
          </div>
        </div>

        {formsData.length === 0 ? (
          <Empty
            description="Chưa có đơn từ nào"
            image={Empty.PRESENTED_IMAGE_SIMPLE}
          />
        ) : (
          <Timeline className="forms-timeline">
            {formsData.map((form) => {
              const config = statusConfig[form.status];
              return (
                <Timeline.Item
                  key={form.id}
                  dot={
                    <div
                      className="timeline-dot"
                      style={{ backgroundColor: config.color }}
                    >
                      {config.icon}
                    </div>
                  }
                >
                  <Card className="form-item-card" hoverable>
                    <div className="form-header">
                      <div className="form-header-left">
                        <div className="form-title-section">
                          <h4 className="form-category">
                            {form.formCategoryTitle}
                          </h4>
                          <Tag
                            color={config.color}
                            icon={config.icon}
                            className="form-status-tag"
                            style={{ backgroundColor: config.bgColor }}
                          >
                            {config.text}
                          </Tag>
                        </div>
                        <div className="form-id">ID: {form.id}</div>
                      </div>
                      <div className="form-header-right">
                        <Button
                          type="primary"
                          icon={<EyeOutlined />}
                          onClick={() => handleViewDetail(form)}
                          size="large"
                        >
                          Xem chi tiết
                        </Button>
                      </div>
                    </div>

                    <Row gutter={[16, 16]}>
                      <Col xs={24}>
                        <div className="form-reason">
                          <strong>Lý do:</strong> {form.reason}
                        </div>

                        <Row gutter={[16, 8]} className="form-info">
                          <Col xs={24} sm={12}>
                            <div className="info-item">
                              <CalendarOutlined className="info-icon" />
                              <span>
                                <strong>Bắt đầu:</strong>{" "}
                                {dayjs(form.startTime).format(
                                  "DD/MM/YYYY HH:mm"
                                )}
                              </span>
                            </div>
                          </Col>
                          <Col xs={24} sm={12}>
                            <div className="info-item">
                              <CalendarOutlined className="info-icon" />
                              <span>
                                <strong>Kết thúc:</strong>{" "}
                                {dayjs(form.endTime).format("DD/MM/YYYY HH:mm")}
                              </span>
                            </div>
                          </Col>
                          <Col xs={24} sm={12}>
                            <div className="info-item">
                              <ClockCircleOutlined className="info-icon" />
                              <span>
                                <strong>Ngày gửi:</strong>{" "}
                                {dayjs(form.createdAt).format(
                                  "DD/MM/YYYY HH:mm"
                                )}
                              </span>
                            </div>
                          </Col>
                          {form.approvedTime && (
                            <Col xs={24} sm={12}>
                              <div className="info-item">
                                <CheckCircleOutlined className="info-icon" />
                                <span>
                                  <strong>Ngày duyệt:</strong>{" "}
                                  {dayjs(form.approvedTime).format(
                                    "DD/MM/YYYY HH:mm"
                                  )}
                                </span>
                              </div>
                            </Col>
                          )}
                        </Row>

                        {form.response && (
                          <div className="form-response">
                            <strong>Phản hồi:</strong> {form.response}
                          </div>
                        )}

                        {form.approvedName && (
                          <div className="form-approver">
                            <strong>Người duyệt:</strong> {form.approvedName}
                          </div>
                        )}

                        {form.file && form.file.length > 0 && (
                          <div className="form-attachments">
                            <PaperClipOutlined /> {form.file.length} tệp đính
                            kèm
                          </div>
                        )}
                      </Col>
                    </Row>
                  </Card>
                </Timeline.Item>
              );
            })}
          </Timeline>
        )}
      </Card>

      {/* Detail Modal */}
      <Modal
        title={
          <div className="modal-title">
            <FileTextOutlined />
            <span>Chi tiết đơn từ</span>
          </div>
        }
        open={detailModalVisible}
        onCancel={() => setDetailModalVisible(false)}
        footer={null}
        width={1200}
        className="form-detail-modal"
        centered
      >
        {selectedForm && (
          <div className="form-detail-content">
            <Row gutter={[24, 0]}>
              {/* Left Column */}
              <Col span={12}>
                <div className="detail-section">
                  <h4>Thông tin đơn</h4>
                  <div className="detail-item">
                    <label>Loại đơn:</label>
                    <span className="detail-value">
                      {selectedForm.formCategoryTitle}
                    </span>
                  </div>
                  <div className="detail-item">
                    <label>Trạng thái:</label>
                    <Tag
                      color={statusConfig[selectedForm.status].color}
                      icon={statusConfig[selectedForm.status].icon}
                    >
                      {statusConfig[selectedForm.status].text}
                    </Tag>
                  </div>
                  <div className="detail-item">
                    <label>ID đơn:</label>
                    <span className="detail-value">{selectedForm.id}</span>
                  </div>
                </div>

                <div className="detail-section">
                  <h4>Nội dung</h4>
                  <div className="detail-item">
                    <label>Lý do:</label>
                    <p className="detail-text">{selectedForm.reason}</p>
                  </div>
                  {selectedForm.response && (
                    <div className="detail-item">
                      <label>Phản hồi:</label>
                      <p className="detail-text">{selectedForm.response}</p>
                    </div>
                  )}
                </div>
              </Col>

              {/* Right Column */}
              <Col span={12}>
                <div className="detail-section">
                  <h4>Thời gian</h4>
                  <div className="detail-item">
                    <label>Bắt đầu:</label>
                    <span className="detail-value">
                      {dayjs(selectedForm.startTime).format("DD/MM/YYYY HH:mm")}
                    </span>
                  </div>
                  <div className="detail-item">
                    <label>Kết thúc:</label>
                    <span className="detail-value">
                      {dayjs(selectedForm.endTime).format("DD/MM/YYYY HH:mm")}
                    </span>
                  </div>
                  <div className="detail-item">
                    <label>Ngày gửi:</label>
                    <span className="detail-value">
                      {dayjs(selectedForm.createdAt).format("DD/MM/YYYY HH:mm")}
                    </span>
                  </div>
                  {selectedForm.approvedTime && (
                    <div className="detail-item">
                      <label>Ngày duyệt:</label>
                      <span className="detail-value">
                        {dayjs(selectedForm.approvedTime).format(
                          "DD/MM/YYYY HH:mm"
                        )}
                      </span>
                    </div>
                  )}
                </div>

                <div className="detail-section">
                  <h4>Người liên quan</h4>
                  <div className="detail-item">
                    <label>Người gửi:</label>
                    <span className="detail-value">
                      {selectedForm.submittedName}
                    </span>
                  </div>
                  {selectedForm.approvedName && (
                    <div className="detail-item">
                      <label>Người duyệt:</label>
                      <span className="detail-value">
                        {selectedForm.approvedName}
                      </span>
                    </div>
                  )}
                </div>

                {selectedForm.file && selectedForm.file.length > 0 && (
                  <div className="detail-section">
                    <h4>Tệp đính kèm ({selectedForm.file.length})</h4>
                    <div className="attachment-grid">
                      <Image.PreviewGroup>
                        {selectedForm.file.map((fileUrl, index) => (
                          <div key={index} className="attachment-item">
                            <Image
                              src={fileUrl}
                              alt={`Attachment ${index + 1}`}
                              width={100}
                              height={100}
                              style={{ objectFit: "cover", borderRadius: 8 }}
                            />
                          </div>
                        ))}
                      </Image.PreviewGroup>
                    </div>
                  </div>
                )}
              </Col>
            </Row>
          </div>
        )}
      </Modal>
    </div>
  );
}

export default UserFormsTab;
