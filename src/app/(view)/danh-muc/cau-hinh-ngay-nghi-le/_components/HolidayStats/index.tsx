// Holiday Statistics Component
import React from "react";
import { Card } from "antd";
import {
  GlobalOutlined,
  UserOutlined,
  CalendarOutlined,
  InfoCircleOutlined,
} from "@ant-design/icons";
import "./HolidayStats.scss";

interface HolidayStatsProps {
  publicCount: number;
  customCount: number;
  monthCount: number;
  totalCount: number;
  lunarCount?: number;
}

const HolidayStats: React.FC<HolidayStatsProps> = ({
  publicCount,
  customCount,
  monthCount,
  totalCount,
  lunarCount = 0,
}) => {
  const stats = [
    {
      icon: <GlobalOutlined className="stat-icon" />,
      value: publicCount,
      label: "Ngày lễ công cộng",
      className: "public-stat",
    },
    {
      icon: <UserOutlined className="stat-icon" />,
      value: customCount,
      label: "Ngày nghỉ tùy chỉnh",
      className: "custom-stat",
    },
    {
      icon: <CalendarOutlined className="stat-icon" />,
      value: monthCount,
      label: "Ngày nghỉ tháng này",
      className: "month-stat",
    },
    {
      icon: <InfoCircleOutlined className="stat-icon" />,
      value: totalCount,
      label: "Tổng số ngày nghỉ",
      className: "total-stat",
    },
  ];

  // Thêm stat cho Tết Âm lịch nếu có
  if (lunarCount > 0) {
    stats.splice(2, 0, {
      icon: <CalendarOutlined className="stat-icon lunar-icon" />,
      value: lunarCount,
      label: "Ngày lễ Âm lịch",
      className: "lunar-stat",
    });
  }

  return (
    <div className="stats-grid">
      {stats.map((stat, index) => (
        <Card
          key={index}
          className={`stat-card ${stat.className}`}
          bordered={false}
          hoverable
          size="small"
          bodyStyle={{ padding: 0 }}
          aria-label={`${stat.label}: ${stat.value}`}
        >
          <div className="stat-content">
            {stat.icon}
            <div className="stat-info">
              <div className="stat-value">{stat.value}</div>
              <div className="stat-label">{stat.label}</div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};

export default HolidayStats;
