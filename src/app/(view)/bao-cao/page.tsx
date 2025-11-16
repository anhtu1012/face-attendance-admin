"use client";
import React from "react";
import { Row, Col, Card } from "antd";
import {
  DashboardOutlined,
  DollarOutlined,
  ClockCircleOutlined,
  FileTextOutlined,
  ArrowRightOutlined,
} from "@ant-design/icons";
import { useRouter } from "next/navigation";
import LayoutContent from "@/components/LayoutContentForder/layoutContent";
import "./index.scss";

interface ReportCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  path: string;
  badge?: string;
}

const ReportCard: React.FC<ReportCardProps> = ({
  title,
  description,
  icon,
  color,
  path,
  badge,
}) => {
  const router = useRouter();

  const handleClick = () => {
    router.push(path);
  };

  return (
    <Card
      className="report-card"
      hoverable
      onClick={handleClick}
      style={{ borderTop: `3px solid ${color}` }}
    >
      <div className="report-card-content">
        <div
          className="report-card-icon"
          style={{ backgroundColor: `${color}10` }}
        >
          <div className="icon-wrapper" style={{ color: color }}>
            {icon}
          </div>
        </div>
        <div className="report-card-info">
          <div className="report-card-header">
            <h3 className="report-card-title">{title}</h3>
            {badge && <span className="report-badge">{badge}</span>}
          </div>
          <p className="report-card-description">{description}</p>
          <div className="report-card-footer">
            <span className="view-report">
              Xem báo cáo <ArrowRightOutlined />
            </span>
          </div>
        </div>
      </div>
    </Card>
  );
};

function BaoCaoIndexPage() {
  const reports: ReportCardProps[] = [
    {
      title: "Dashboard Chấm Công",
      description:
        "Thống kê tổng quan về chấm công, tỷ lệ đi làm, vi phạm và xu hướng theo thời gian",
      icon: <DashboardOutlined style={{ fontSize: 32 }} />,
      color: "#1565C0",
      path: "/bao-cao/dashboard",
      badge: "Mới",
    },
    {
      title: "Dashboard Lương",
      description:
        "Thống kê chi tiết về quỹ lương, cơ cấu chi phí, thưởng và xu hướng lương theo thời gian",
      icon: <DollarOutlined style={{ fontSize: 32 }} />,
      color: "#42A5F5",
      path: "/bao-cao/dashboard-luong",
      badge: "Mới",
    },
    {
      title: "Báo Cáo Chấm Công",
      description:
        "Báo cáo chi tiết chấm công của từng nhân viên, bao gồm giờ vào ra, tăng ca và vi phạm",
      icon: <ClockCircleOutlined style={{ fontSize: 32 }} />,
      color: "#1890ff",
      path: "/bao-cao/bao-cao-cham-cong",
    },
    {
      title: "Báo Cáo Lương",
      description:
        "Báo cáo chi tiết lương của từng nhân viên, bao gồm lương cơ bản, thưởng và khấu trừ",
      icon: <FileTextOutlined style={{ fontSize: 32 }} />,
      color: "#096dd9",
      path: "/bao-cao/bao-cao-luong",
    },
  ];

  return (
    <div className="bao-cao-index-page">
      <LayoutContent
        layoutType={1}
        option={{
          floatButton: true,
          cardTitle: "Hệ Thống Báo Cáo",
        }}
        content1={
          <div className="bao-cao-index-content">
            <div className="page-header">
              <div className="header-icon">
                <DashboardOutlined />
              </div>
              <h1 className="page-title">Hệ Thống Báo Cáo & Thống Kê</h1>
              <p className="page-description">
                Chọn loại báo cáo hoặc dashboard bạn muốn xem để theo dõi và
                phân tích dữ liệu chấm công và lương của công ty
              </p>
            </div>

            <Row gutter={[24, 24]} className="reports-section">
              {reports.map((report, index) => (
                <Col xs={24} sm={12} lg={12} xl={12} key={index}>
                  <ReportCard {...report} />
                </Col>
              ))}
            </Row>

            <div className="info-section">
              <Card className="info-card">
                <Row gutter={[24, 16]}>
                  <Col xs={24} md={8}>
                    <div className="info-item">
                      <div className="info-icon dashboard">
                        <DashboardOutlined />
                      </div>
                      <div className="info-content">
                        <h4>Dashboard Thống Kê</h4>
                        <p>
                          Xem tổng quan và phân tích dữ liệu với các biểu đồ
                          trực quan, dễ hiểu
                        </p>
                      </div>
                    </div>
                  </Col>
                  <Col xs={24} md={8}>
                    <div className="info-item">
                      <div className="info-icon report">
                        <FileTextOutlined />
                      </div>
                      <div className="info-content">
                        <h4>Báo Cáo Chi Tiết</h4>
                        <p>
                          Tra cứu thông tin chi tiết của từng nhân viên với khả
                          năng lọc và export
                        </p>
                      </div>
                    </div>
                  </Col>
                  <Col xs={24} md={8}>
                    <div className="info-item">
                      <div className="info-icon clock">
                        <ClockCircleOutlined />
                      </div>
                      <div className="info-content">
                        <h4>Cập Nhật Realtime</h4>
                        <p>
                          Dữ liệu được cập nhật liên tục để đảm bảo thông tin
                          luôn chính xác
                        </p>
                      </div>
                    </div>
                  </Col>
                </Row>
              </Card>
            </div>
          </div>
        }
      />
    </div>
  );
}

export default BaoCaoIndexPage;
