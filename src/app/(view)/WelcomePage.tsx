"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Button, Card, Col, Row, Typography } from "antd";
import {
  UserOutlined,
  TeamOutlined,
  ClockCircleOutlined,
  FileTextOutlined,
  BarChartOutlined,
  SettingOutlined,
  CalendarOutlined,
  DollarOutlined,
} from "@ant-design/icons";
import "./WelcomePage.scss";

const { Title, Paragraph } = Typography;

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  path: string;
  color: string;
}

const WelcomePage = () => {
  const router = useRouter();

  const features: FeatureCardProps[] = [
    {
      icon: <UserOutlined />,
      title: "Quản lý nhân sự",
      description: "Quản lý thông tin nhân viên, hồ sơ và công việc",
      path: "/tac-vu-nhan-su/nhan-vien",
      color: "#1890ff",
    },
    {
      icon: <TeamOutlined />,
      title: "Tuyển dụng",
      description: "Quản lý quy trình tuyển dụng và ứng viên",
      path: "/tac-vu-nhan-su/tuyen-dung",
      color: "#52c41a",
    },
    {
      icon: <ClockCircleOutlined />,
      title: "Chấm công",
      description: "Quản lý giờ làm việc và điểm danh nhân viên",
      path: "/quan-li-lich-lam-viec/cham-cong",
      color: "#faad14",
    },
    {
      icon: <FileTextOutlined />,
      title: "Quản lý đơn từ",
      description: "Xử lý đơn xin nghỉ, đơn công tác và các đơn khác",
      path: "/tac-vu-nhan-su/quan-ly-don-tu",
      color: "#13c2c2",
    },
    {
      icon: <DollarOutlined />,
      title: "Quản lý lương",
      description: "Tính lương, thưởng và các khoản phụ cấp",
      path: "/quan-ly-luong",
      color: "#eb2f96",
    },
    {
      icon: <CalendarOutlined />,
      title: "Lịch làm việc",
      description: "Quản lý ca làm việc và lịch trình",
      path: "/quan-li-lich-lam-viec",
      color: "#722ed1",
    },
    {
      icon: <BarChartOutlined />,
      title: "Báo cáo",
      description: "Thống kê và báo cáo hiệu suất làm việc",
      path: "/bao-cao",
      color: "#fa8c16",
    },
    {
      icon: <SettingOutlined />,
      title: "Cài đặt hệ thống",
      description: "Cấu hình và quản trị hệ thống",
      path: "/quan-tri-he-thong",
      color: "#595959",
    },
  ];

  const handleCardClick = (path: string) => {
    router.push(path);
  };

  return (
    <div className="welcome-page">
      <div className="welcome-header">
        <div className="welcome-header-content">
          <Title level={1} className="welcome-title">
            Chào mừng đến với Hệ thống Quản lý Nhân sự
          </Title>
          <Paragraph className="welcome-subtitle">
            Giải pháp toàn diện cho quản lý nhân sự, chấm công và tính lương
          </Paragraph>
        </div>
        <div className="welcome-background-animation">
          <div className="circle circle-1"></div>
          <div className="circle circle-2"></div>
          <div className="circle circle-3"></div>
        </div>
      </div>

      <div className="welcome-content">
        <div className="features-section">
          <Title level={2} className="section-title">
            Chức năng chính
          </Title>
          <Row gutter={[24, 24]}>
            {features.map((feature, index) => (
              <Col xs={24} sm={12} lg={6} key={index}>
                <Card
                  className="feature-card"
                  hoverable
                  onClick={() => handleCardClick(feature.path)}
                  style={
                    { "--card-color": feature.color } as React.CSSProperties
                  }
                >
                  <div
                    className="feature-icon"
                    style={{ color: feature.color }}
                  >
                    {feature.icon}
                  </div>
                  <Title level={4} className="feature-title">
                    {feature.title}
                  </Title>
                  <Paragraph className="feature-description">
                    {feature.description}
                  </Paragraph>
                  <Button type="link" className="feature-button">
                    Truy cập →
                  </Button>
                </Card>
              </Col>
            ))}
          </Row>
        </div>

        <div className="quick-stats">
          <Row gutter={[24, 24]}>
            <Col xs={24} sm={12} md={6}>
              <div className="stat-card stat-card-1">
                <div className="stat-icon">
                  <UserOutlined />
                </div>
                <div className="stat-content">
                  <div className="stat-label">Tổng nhân viên</div>
                  <div className="stat-value">---</div>
                </div>
              </div>
            </Col>
            <Col xs={24} sm={12} md={6}>
              <div className="stat-card stat-card-2">
                <div className="stat-icon">
                  <ClockCircleOutlined />
                </div>
                <div className="stat-content">
                  <div className="stat-label">Đang làm việc</div>
                  <div className="stat-value">---</div>
                </div>
              </div>
            </Col>
            <Col xs={24} sm={12} md={6}>
              <div className="stat-card stat-card-3">
                <div className="stat-icon">
                  <FileTextOutlined />
                </div>
                <div className="stat-content">
                  <div className="stat-label">Đơn chờ duyệt</div>
                  <div className="stat-value">---</div>
                </div>
              </div>
            </Col>
            <Col xs={24} sm={12} md={6}>
              <div className="stat-card stat-card-4">
                <div className="stat-icon">
                  <TeamOutlined />
                </div>
                <div className="stat-content">
                  <div className="stat-label">Ứng viên mới</div>
                  <div className="stat-value">---</div>
                </div>
              </div>
            </Col>
          </Row>
        </div>
      </div>
    </div>
  );
};

export default WelcomePage;
