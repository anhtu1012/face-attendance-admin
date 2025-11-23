/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import {
  BankOutlined,
  CalendarOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  DollarOutlined,
  DownloadOutlined,
  FileTextOutlined,
  HistoryOutlined,
  PaperClipOutlined,
  UserOutlined,
} from "@ant-design/icons";
import {
  Button,
  Card,
  Col,
  Descriptions,
  Divider,
  Empty,
  Row,
  Tag,
  Timeline,
} from "antd";
import dayjs from "dayjs";
import "./UserContractTab.scss";

interface AllowanceInfo {
  allowanceId: string;
  allowanceName: string;
  allowanceCode: string;
  value: string;
}

interface ContractData {
  id: string;
  createdAt: string;
  updatedAt: string;
  userId: string;
  fullNameUser: string;
  manageByUserId: string;
  fullNameManager: string;
  departmentId: string;
  departmentName: string;
  positionId: string;
  positionName: string;
  contractTypeId: string;
  contractTypeName: string;
  companyId: string;
  grossSalary: string;
  contractNumber: string;
  content: string;
  fileContract: string;
  startDate: string;
  endDate: string | null;
  duration: string;
  status: string;
  allowanceInfors: AllowanceInfo[];
  isSignature: boolean;
}

interface UserContractTabProps {
  userId: string;
}

function UserContractTab({ userId }: UserContractTabProps) {
  // Mock data - replace with actual API call
  const contractData: ContractData = {
    id: "15",
    createdAt: "2025-10-28T15:34:24.699Z",
    updatedAt: "2025-10-28T15:34:24.699Z",
    userId: "13",
    fullNameUser: "Phạm Hoàng Phúc",
    manageByUserId: "19",
    fullNameManager: "Anh Nhím",
    departmentId: "1",
    departmentName: "Phòng Phát triển phần mềm",
    positionId: "7",
    positionName: "Frontend Developer",
    contractTypeId: "1",
    contractTypeName: "Hợp đồng dịch vụ",
    companyId: "10",
    grossSalary: "25000000",
    contractNumber: "002/2025-FAAS",
    content:
      '<p><strong>ĐIỀU 1. ĐỐI TƯỢNG CỦA HỢP ĐỒNG</strong> <sup style="background-color: transparent;">1</sup>Bên A tuyển dụng học viên là Bên B vào vị trí học việc lập trình với nội dung chi tiết quy định tại Điều 2 và Điều 3 của Hợp đồng này. <sup style="background-color: transparent;">2</sup></p><p><br></p><p><strong>ĐIỀU 2. THỜI GIAN HỌC VIỆC</strong> <sup style="background-color: transparent;">3</sup>Bên A tạo điều kiện cho Bên B học việc theo Hợp đồng trong thời hạn 03 tháng, kể từ ngày 16 tháng 09 năm 2025 đến ngày 15 tháng 12 năm 2025 <sup style="background-color: transparent;">4</sup></p>',
    fileContract:
      "https://minio-api.faceattendance.dev/faas/contract/15/1761738179174-contract (2).pdf",
    startDate: "2025-11-02T17:00:00.000Z",
    endDate: null,
    duration: "0",
    status: "ACTIVE_EXTENDED",
    allowanceInfors: [
      {
        allowanceId: "4",
        allowanceName: "Ăn trưa",
        allowanceCode: "ALLOWANCE-001",
        value: "50000",
      },
    ],
    isSignature: false,
  };
  console.log(userId);

  const formatDate = (date: string | null) => {
    return date ? dayjs(date).format("DD/MM/YYYY") : "N/A";
  };

  const formatCurrency = (amount: string) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(Number(amount));
  };

  const getStatusTag = (status: string) => {
    const statusMap: Record<
      string,
      { color: string; text: string; icon: any }
    > = {
      ACTIVE: {
        color: "success",
        text: "Đang hiệu lực",
        icon: <CheckCircleOutlined />,
      },
      ACTIVE_EXTENDED: {
        color: "processing",
        text: "Đang hiệu lực (Gia hạn)",
        icon: <CheckCircleOutlined />,
      },
      EXPIRED: {
        color: "error",
        text: "Hết hạn",
        icon: <ClockCircleOutlined />,
      },
      TERMINATED: {
        color: "default",
        text: "Đã chấm dứt",
        icon: <ClockCircleOutlined />,
      },
      PENDING: {
        color: "warning",
        text: "Chờ xử lý",
        icon: <ClockCircleOutlined />,
      },
    };

    const status_info = statusMap[status] || {
      color: "default",
      text: status,
      icon: null,
    };
    return (
      <Tag color={status_info.color} icon={status_info.icon}>
        {status_info.text}
      </Tag>
    );
  };

  // Mock history data
  const historyData = [
    {
      date: "2025-11-02",
      action: "Tạo hợp đồng",
      description: "Hợp đồng được tạo và gửi cho nhân viên",
      user: "Admin System",
    },
    {
      date: "2025-11-03",
      action: "Nhân viên xem hợp đồng",
      description: "Phạm Hoàng Phúc đã xem hợp đồng",
      user: "Phạm Hoàng Phúc",
    },
    {
      date: "2025-11-10",
      action: "Gia hạn hợp đồng",
      description: "Hợp đồng được gia hạn thêm 6 tháng",
      user: "Anh Nhím",
    },
  ];

  // Mock appendix data
  const appendixData = [
    {
      id: "1",
      name: "Phụ lục 1 - Bảng lương chi tiết",
      createdAt: "2025-11-02",
      fileUrl: "#",
    },
    {
      id: "2",
      name: "Phụ lục 2 - Quy định về chế độ làm việc",
      createdAt: "2025-11-05",
      fileUrl: "#",
    },
  ];

  const handleDownloadContract = () => {
    window.open(contractData.fileContract, "_blank");
  };

  return (
    <div className="user-contract-tab">
      {/* Header with Contract Number */}
      <div className="contract-header">
        <div className="contract-header-content">
          <div className="contract-title">
            <FileTextOutlined className="contract-icon" />
            <div>
              <h2>Hợp đồng #{contractData.contractNumber}</h2>
              <p className="contract-type">{contractData.contractTypeName}</p>
            </div>
          </div>
          <div className="contract-actions">
            {getStatusTag(contractData.status)}
            <Button
              type="primary"
              icon={<DownloadOutlined />}
              onClick={handleDownloadContract}
              className="download-btn"
            >
              Tải hợp đồng
            </Button>
          </div>
        </div>
      </div>

      {/* Main Contract Information */}
      <Row gutter={[16, 16]}>
        <Col xs={24} lg={16}>
          <Card
            title={
              <span className="card-title">
                <FileTextOutlined /> Thông tin hợp đồng
              </span>
            }
            className="contract-info-card"
          >
            <Descriptions column={2} bordered>
              <Descriptions.Item label="Số hợp đồng" span={2}>
                <strong>{contractData.contractNumber}</strong>
              </Descriptions.Item>
              <Descriptions.Item label="Loại hợp đồng" span={2}>
                {contractData.contractTypeName}
              </Descriptions.Item>
              <Descriptions.Item
                label={
                  <>
                    <UserOutlined /> Nhân viên
                  </>
                }
              >
                {contractData.fullNameUser}
              </Descriptions.Item>
              <Descriptions.Item
                label={
                  <>
                    <UserOutlined /> Người quản lý
                  </>
                }
              >
                {contractData.fullNameManager}
              </Descriptions.Item>
              <Descriptions.Item label="Phòng ban">
                {contractData.departmentName}
              </Descriptions.Item>
              <Descriptions.Item label="Vị trí">
                {contractData.positionName}
              </Descriptions.Item>
              <Descriptions.Item
                label={
                  <>
                    <CalendarOutlined /> Ngày bắt đầu
                  </>
                }
              >
                {formatDate(contractData.startDate)}
              </Descriptions.Item>
              <Descriptions.Item
                label={
                  <>
                    <CalendarOutlined /> Ngày kết thúc
                  </>
                }
              >
                {formatDate(contractData.endDate)}
              </Descriptions.Item>
              <Descriptions.Item label="Thời hạn hợp đồng">
                {contractData.duration} tháng
              </Descriptions.Item>
              <Descriptions.Item label="Trạng thái ký">
                {contractData.isSignature ? (
                  <Tag color="success" icon={<CheckCircleOutlined />}>
                    Đã ký
                  </Tag>
                ) : (
                  <Tag color="warning" icon={<ClockCircleOutlined />}>
                    Chưa ký
                  </Tag>
                )}
              </Descriptions.Item>
            </Descriptions>
          </Card>

          {/* Contract Content */}
          <Card
            title={
              <span className="card-title">
                <FileTextOutlined /> Nội dung hợp đồng
              </span>
            }
            className="contract-content-card"
          >
            <div
              className="contract-content-html"
              dangerouslySetInnerHTML={{ __html: contractData.content }}
            />
          </Card>
        </Col>

        <Col xs={24} lg={8}>
          {/* Salary Information */}
          <Card
            title={
              <span className="card-title">
                <DollarOutlined /> Lương & Phụ cấp
              </span>
            }
            className="salary-card"
          >
            <div className="gross-salary-section">
              <div className="salary-label">Lương Gross</div>
              <div className="salary-amount">
                {formatCurrency(contractData.grossSalary)}
              </div>
            </div>

            <Divider />

            <div className="allowances-section">
              <h4>Phụ cấp</h4>
              {contractData.allowanceInfors &&
              contractData.allowanceInfors.length > 0 ? (
                <div className="allowances-list">
                  {contractData.allowanceInfors.map((allowance) => (
                    <div key={allowance.allowanceId} className="allowance-item">
                      <div className="allowance-info">
                        <span className="allowance-name">
                          {allowance.allowanceName}
                        </span>
                        <span className="allowance-code">
                          {allowance.allowanceCode}
                        </span>
                      </div>
                      <div className="allowance-value">
                        {formatCurrency(allowance.value)}
                      </div>
                    </div>
                  ))}
                  <Divider style={{ margin: "12px 0" }} />
                  <div className="total-salary">
                    <span>Tổng thu nhập</span>
                    <strong>
                      {formatCurrency(
                        String(
                          Number(contractData.grossSalary) +
                            contractData.allowanceInfors.reduce(
                              (sum, a) => sum + Number(a.value),
                              0
                            )
                        )
                      )}
                    </strong>
                  </div>
                </div>
              ) : (
                <Empty description="Không có phụ cấp" />
              )}
            </div>
          </Card>

          {/* Quick Stats */}
          <Card className="stats-card">
            <div className="stat-item">
              <div
                className="stat-icon"
                style={{
                  background: "linear-gradient(135deg, #1890ff, #36cfc9)",
                }}
              >
                <CalendarOutlined />
              </div>
              <div className="stat-info">
                <div className="stat-label">Ngày tạo</div>
                <div className="stat-value">
                  {formatDate(contractData.createdAt)}
                </div>
              </div>
            </div>
            <Divider />
            <div className="stat-item">
              <div
                className="stat-icon"
                style={{
                  background: "linear-gradient(135deg, #52c41a, #73d13d)",
                }}
              >
                <BankOutlined />
              </div>
              <div className="stat-info">
                <div className="stat-label">Công ty</div>
                <div className="stat-value">ID: {contractData.companyId}</div>
              </div>
            </div>
          </Card>
        </Col>
      </Row>

      {/* History and Appendix Section */}
      <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
        {/* History */}
        <Col xs={24} lg={12}>
          <Card
            title={
              <span className="card-title">
                <HistoryOutlined /> Lịch sử thay đổi
              </span>
            }
            className="history-card"
          >
            <Timeline
              items={historyData.map((item, index) => ({
                color: index === 0 ? "green" : "blue",
                dot: index === 0 ? <CheckCircleOutlined /> : undefined,
                children: (
                  <div className="history-item">
                    <div className="history-header">
                      <span className="history-action">{item.action}</span>
                      <span className="history-date">
                        {formatDate(item.date)}
                      </span>
                    </div>
                    <div className="history-description">
                      {item.description}
                    </div>
                    <div className="history-user">
                      <UserOutlined /> {item.user}
                    </div>
                  </div>
                ),
              }))}
            />
          </Card>
        </Col>

        {/* Appendix */}
        <Col xs={24} lg={12}>
          <Card
            title={
              <span className="card-title">
                <PaperClipOutlined /> Phụ lục hợp đồng
              </span>
            }
            className="appendix-card"
          >
            {appendixData && appendixData.length > 0 ? (
              <div className="appendix-list">
                {appendixData.map((appendix) => (
                  <div key={appendix.id} className="appendix-item">
                    <div className="appendix-icon">
                      <FileTextOutlined />
                    </div>
                    <div className="appendix-info">
                      <div className="appendix-name">{appendix.name}</div>
                      <div className="appendix-date">
                        Ngày tạo: {formatDate(appendix.createdAt)}
                      </div>
                    </div>
                    <Button
                      type="link"
                      icon={<DownloadOutlined />}
                      onClick={() => window.open(appendix.fileUrl, "_blank")}
                    >
                      Tải
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <Empty description="Không có phụ lục" />
            )}
          </Card>
        </Col>
      </Row>
    </div>
  );
}

export default UserContractTab;
