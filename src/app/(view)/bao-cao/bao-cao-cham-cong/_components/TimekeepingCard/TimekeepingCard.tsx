"use client";
import { Card, Col, Row, Statistic, Tag, Typography } from "antd";
import {
  ClockCircleOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  WarningOutlined,
  UserOutlined,
  TeamOutlined,
  CalendarOutlined,
  HourglassOutlined,
  DollarOutlined,
} from "@ant-design/icons";
import { TimekeepingReportData } from "../../_types/prop";
import "./TimekeepingCard.scss";

const { Title, Text } = Typography;

interface TimekeepingCardProps {
  data: TimekeepingReportData;
}

export default function TimekeepingCard({ data }: TimekeepingCardProps) {
  const attendanceRate =
    data.monthStandardTimekeeping > 0
      ? (
          (data.actualTimekeeping / data.monthStandardTimekeeping) *
          100
        ).toFixed(1)
      : "0";

  const hourRate =
    data.monthStandardHour > 0
      ? ((data.actualHour / data.monthStandardHour) * 100).toFixed(1)
      : "0";

  return (
    <div className="timekeeping-card-container">
      {/* User Info Header */}
      <Card className="user-info-card" bordered={false}>
        <Row gutter={[16, 16]} align="middle">
          <Col xs={24} md={12}>
            <div className="user-info-section">
              <UserOutlined className="user-icon" />
              <div className="user-details">
                <Title level={4} className="user-name">
                  {data.fullNameUser}
                </Title>
                <div className="user-meta">
                  <Tag color="blue" icon={<TeamOutlined />}>
                    {data.departmentName}
                  </Tag>
                  <Tag color="green">{data.positionName}</Tag>
                </div>
              </div>
            </div>
          </Col>
          <Col xs={24} md={12}>
            <div className="manager-info">
              <Text type="secondary">Quản lý:</Text>
              <Text strong style={{ marginLeft: 8 }}>
                {data.fullNameManager}
              </Text>
            </div>
          </Col>
        </Row>
      </Card>

      {/* Statistics Grid */}
      <Row gutter={[16, 16]}>
        {/* Attendance Stats */}
        <Col xs={24} lg={12}>
          <Card
            title={
              <span className="card-title">
                <CalendarOutlined /> Thống kê chấm công
              </span>
            }
            className="stat-card attendance-card"
            bordered={false}
          >
            <Row gutter={[16, 16]}>
              <Col xs={12}>
                <Statistic
                  title="Ngày công thực tế"
                  value={data.actualTimekeeping}
                  suffix={`/ ${data.monthStandardTimekeeping}`}
                  valueStyle={{ color: "#1890ff", fontSize: "24px" }}
                  prefix={<CheckCircleOutlined />}
                />
                <div className="progress-bar">
                  <div
                    className="progress-fill attendance-fill"
                    style={{ width: `${attendanceRate}%` }}
                  />
                </div>
                <Text type="secondary" style={{ fontSize: "12px" }}>
                  Tỷ lệ: {attendanceRate}%
                </Text>
              </Col>
              <Col xs={12}>
                <Statistic
                  title="Giờ công thực tế"
                  value={data.actualHour}
                  suffix={`/ ${data.monthStandardHour}h`}
                  valueStyle={{ color: "#52c41a", fontSize: "24px" }}
                  prefix={<HourglassOutlined />}
                />
                <div className="progress-bar">
                  <div
                    className="progress-fill hour-fill"
                    style={{ width: `${hourRate}%` }}
                  />
                </div>
                <Text type="secondary" style={{ fontSize: "12px" }}>
                  Tỷ lệ: {hourRate}%
                </Text>
              </Col>
            </Row>
          </Card>
        </Col>

        {/* Violation Stats */}
        <Col xs={24} lg={12}>
          <Card
            title={
              <span className="card-title">
                <WarningOutlined /> Vi phạm & cảnh báo
              </span>
            }
            className="stat-card violation-card"
            bordered={false}
          >
            <Row gutter={[12, 12]}>
              <Col xs={12}>
                <div className="violation-item late">
                  <CloseCircleOutlined className="violation-icon" />
                  <div>
                    <Text strong style={{ fontSize: "20px" }}>
                      {data.lateNumber}
                    </Text>
                    <div>
                      <Text type="secondary">Đi muộn</Text>
                    </div>
                  </div>
                </div>
              </Col>
              <Col xs={12}>
                <div className="violation-item early">
                  <CloseCircleOutlined className="violation-icon" />
                  <div>
                    <Text strong style={{ fontSize: "20px" }}>
                      {data.earlyNumber}
                    </Text>
                    <div>
                      <Text type="secondary">Về sớm</Text>
                    </div>
                  </div>
                </div>
              </Col>
              <Col xs={12}>
                <div className="violation-item absent">
                  <WarningOutlined className="violation-icon" />
                  <div>
                    <Text strong style={{ fontSize: "20px" }}>
                      {data.offWorkNumber}
                    </Text>
                    <div>
                      <Text type="secondary">Nghỉ việc</Text>
                    </div>
                  </div>
                </div>
              </Col>
              <Col xs={12}>
                <div className="violation-item forget">
                  <ClockCircleOutlined className="violation-icon" />
                  <div>
                    <Text strong style={{ fontSize: "20px" }}>
                      {data.forgetLogNumber}
                    </Text>
                    <div>
                      <Text type="secondary">Quên chấm</Text>
                    </div>
                  </div>
                </div>
              </Col>
            </Row>
          </Card>
        </Col>

        {/* Overtime Stats */}
        <Col xs={24} lg={12}>
          <Card
            title={
              <span className="card-title">
                <ClockCircleOutlined /> Thời gian tăng ca
              </span>
            }
            className="stat-card overtime-card"
            bordered={false}
          >
            <Row gutter={[16, 16]}>
              <Col xs={24}>
                <div className="ot-item">
                  <Text type="secondary">Tăng ca ngày thường:</Text>
                  <div className="ot-values">
                    <Tag color="blue">{data.normalOtTimekeeping} ngày</Tag>
                    <Tag color="cyan">{data.normalOtHour}h</Tag>
                  </div>
                </div>
              </Col>
              <Col xs={24}>
                <div className="ot-item">
                  <Text type="secondary">Tăng ca ngày nghỉ:</Text>
                  <div className="ot-values">
                    <Tag color="orange">{data.offDayOtTimekeeping} ngày</Tag>
                    <Tag color="gold">{data.offDayOtHour}h</Tag>
                  </div>
                </div>
              </Col>
              <Col xs={24}>
                <div className="ot-item">
                  <Text type="secondary">Tăng ca ngày lễ:</Text>
                  <div className="ot-values">
                    <Tag color="purple">{data.holidayOtTimekeeping} ngày</Tag>
                    <Tag color="magenta">{data.holidayOtHour}h</Tag>
                  </div>
                </div>
              </Col>
            </Row>
          </Card>
        </Col>

        {/* Fine Stats */}
        <Col xs={24} lg={12}>
          <Card
            title={
              <span className="card-title">
                <DollarOutlined /> Thông tin phạt
              </span>
            }
            className="stat-card fine-card"
            bordered={false}
          >
            <Row gutter={[16, 16]}>
              <Col xs={24}>
                <div className="fine-item">
                  <Text type="secondary">Phạt đi muộn:</Text>
                  <Text strong className="fine-value">
                    {data.lateFine} VNĐ
                  </Text>
                </div>
              </Col>
              <Col xs={24}>
                <div className="fine-item">
                  <Text type="secondary">Phạt quên chấm:</Text>
                  <Text strong className="fine-value">
                    {data.forgetLogFine} VNĐ
                  </Text>
                </div>
              </Col>
              <Col xs={24}>
                <div className="total-fine">
                  <Text strong>Tổng phạt:</Text>
                  <Text strong className="total-fine-value">
                    {(
                      parseInt(data.lateFine.replace(/,/g, "")) +
                      parseInt(data.forgetLogFine.replace(/,/g, ""))
                    ).toLocaleString()}{" "}
                    VNĐ
                  </Text>
                </div>
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>
    </div>
  );
}
