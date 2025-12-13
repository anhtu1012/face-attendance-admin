import React from "react";
import { Card, Statistic, Row, Col } from "antd";
import {
  ArrowUpOutlined,
  ArrowDownOutlined,
  MinusOutlined,
} from "@ant-design/icons";
import "./StatisticCard.scss";

interface TrendInfo {
  value: number;
  isPositive?: boolean;
  isNeutral?: boolean;
}

interface StatisticCardProps {
  title: string;
  value: string | number;
  icon?: React.ReactNode;
  color?: string;
  trend?: TrendInfo;
  loading?: boolean;
  suffix?: string;
  prefix?: string;
  valueStyle?: React.CSSProperties;
  description?: string;
}

const StatisticCard: React.FC<StatisticCardProps> = ({
  title,
  value,
  icon,
  color = "#1890ff",
  trend,
  loading = false,
  suffix,
  prefix,
  valueStyle,
  description,
}) => {
  const getTrendIcon = () => {
    if (!trend) return null;
    if (trend.isNeutral) return <MinusOutlined />;
    return trend.isPositive ? <ArrowUpOutlined /> : <ArrowDownOutlined />;
  };

  const getTrendColor = () => {
    if (!trend) return undefined;
    if (trend.isNeutral) return "#8c8c8c";
    return trend.isPositive ? "#3f8600" : "#cf1322";
  };

  return (
    <Card
      className="statistic-card"
      loading={loading}
      bordered={false}
      style={{
        borderLeft: `4px solid ${color}`,
      }}
    >
      <Row align="middle" gutter={16}>
        {icon && (
          <Col>
            <div
              className="statistic-card-icon"
              style={{ backgroundColor: color }}
            >
              {icon}
            </div>
          </Col>
        )}
        <Col flex="auto">
          <Statistic
            title={<span className="statistic-card-title">{title}</span>}
            value={value}
            suffix={suffix}
            prefix={prefix}
            valueStyle={{
              fontSize: "24px",
              fontWeight: 600,
              color: color,
              ...valueStyle,
            }}
          />
          {description && (
            <div className="statistic-card-description">{description}</div>
          )}
          {trend && (
            <div className="statistic-card-trend">
              <span style={{ color: getTrendColor() }}>
                {getTrendIcon()}
                <span style={{ marginLeft: 4 }}>{Math.abs(trend.value)}%</span>
              </span>
              <span style={{ marginLeft: 8, color: "#8c8c8c" }}>
                so với kỳ trước
              </span>
            </div>
          )}
        </Col>
      </Row>
    </Card>
  );
};

export default StatisticCard;
