"use client";
import React from "react";
import {
  TrophyOutlined,
  DollarOutlined,
  TeamOutlined,
  RiseOutlined,
  WalletOutlined,
} from "@ant-design/icons";
import "./SalarySummaryStats.scss";

interface SalarySummaryStatsProps {
  totalSalary: number;
  totalEmployees: number;
  averageSalary: number;
  totalNetSalary: number;
  formatCurrency: (value: number) => string;
  topDepartments?: Array<{
    name: string;
    avgSalary: number;
    count: number;
  }>;
}

const SalarySummaryStats: React.FC<SalarySummaryStatsProps> = ({
  totalSalary,
  totalEmployees,
  averageSalary,
  totalNetSalary,
  formatCurrency,
  topDepartments = [],
}) => {
  return (
    <div className="statsCard">
      <div className="statsHeader">
        <DollarOutlined className="statsIcon" />
        <h3 className="statsTitle">Tổng quan lương</h3>
      </div>

      <div className="statItem">
        <div className="statLabelWrapper">
          <WalletOutlined className="statIcon" />
          <span className="statLabel">Tổng quỹ lương</span>
        </div>
        <span className="statValue">{formatCurrency(totalSalary)}</span>
      </div>

      <div className="statItem">
        <div className="statLabelWrapper">
          <TeamOutlined className="statIcon" />
          <span className="statLabel">Tổng nhân viên</span>
        </div>
        <span className="statValue">{totalEmployees}</span>
      </div>

      <div className="statItem">
        <div className="statLabelWrapper">
          <RiseOutlined className="statIcon" />
          <span className="statLabel">Lương TB/người</span>
        </div>
        <span className="statValue">{formatCurrency(averageSalary)}</span>
      </div>

      <div className="statItem">
        <div className="statLabelWrapper">
          <DollarOutlined className="statIcon" />
          <span className="statLabel">Đã thanh toán</span>
        </div>
        <span className="statValue">{formatCurrency(totalNetSalary)}</span>
      </div>

      {topDepartments && topDepartments.length > 0 && (
        <div className="topSection">
          <h4 className="topTitle">
            <TrophyOutlined className="topIcon" />
            Top phòng ban cao nhất
          </h4>
          <ol>
            {topDepartments.map((dept, index) => (
              <li key={index}>
                <strong>{dept.name}</strong> - TB:{" "}
                {formatCurrency(dept.avgSalary)} ({dept.count} NV)
              </li>
            ))}
          </ol>
        </div>
      )}
    </div>
  );
};

export default SalarySummaryStats;
