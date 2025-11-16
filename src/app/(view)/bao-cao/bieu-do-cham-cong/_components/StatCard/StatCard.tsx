import React from "react";
import { Card, Statistic } from "antd";
import { ArrowUpOutlined, ArrowDownOutlined } from "@ant-design/icons";
import "./StatCard.scss";

interface StatCardProps {
  title: string;
  value: number | string;
  suffix?: string;
  prefix?: string;
  icon?: React.ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  loading?: boolean;
  color?: string;
  valueStyle?: React.CSSProperties;
}

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  suffix,
  prefix,
  icon,
  trend,
  loading = false,
  color = "#1890ff",
  valueStyle,
}) => {
  return (
    <Card className="stat-card" bordered={false} loading={loading}>
      <div className="stat-card-content">
        <div className="stat-card-icon" style={{ backgroundColor: `${color}15` }}>
          <div className="icon-wrapper" style={{ color: color }}>
            {icon}
          </div>
        </div>
        <div className="stat-card-info">
          <div className="stat-card-title">{title}</div>
          <Statistic
            value={value}
            suffix={suffix}
            prefix={prefix}
            valueStyle={{
              fontSize: "24px",
              fontWeight: 600,
              color: "#262626",
              ...valueStyle,
            }}
          />
          {trend && (
            <div className="stat-card-trend">
              {trend.isPositive ? (
                <ArrowUpOutlined style={{ color: "#52c41a" }} />
              ) : (
                <ArrowDownOutlined style={{ color: "#ff4d4f" }} />
              )}
              <span
                style={{
                  color: trend.isPositive ? "#52c41a" : "#ff4d4f",
                  marginLeft: "4px",
                }}
              >
                {Math.abs(trend.value)}%
              </span>
              <span style={{ color: "#8c8c8c", marginLeft: "4px" }}>
                so với tháng trước
              </span>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};

export default StatCard;

