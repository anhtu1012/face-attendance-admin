"use client";
import React from "react";
import {
  TrophyOutlined,
  TeamOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  WarningOutlined,
} from "@ant-design/icons";
import "./SummaryStats.scss";

interface SummaryStatsProps {
  totalEmployees: number;
  presentCount: number;
  attendanceRate: number;
  lateCount: number;
  topPerformers?: Array<{
    name: string;
    department: string;
    rate: number;
  }>;
}

const SummaryStats: React.FC<SummaryStatsProps> = ({
  totalEmployees,
  presentCount,
  attendanceRate,
  lateCount,
  topPerformers = [],
}) => {
  return (
    <div className="statsCard">
      <div className="statsHeader">
        <TrophyOutlined className="statsIcon" />
        <h3 className="statsTitle">Tổng quan chấm công</h3>
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
          <CheckCircleOutlined className="statIcon" />
          <span className="statLabel">Đã chấm công</span>
        </div>
        <span className="statValue">{presentCount}</span>
      </div>

      <div className="statItem">
        <div className="statLabelWrapper">
          <ClockCircleOutlined className="statIcon" />
          <span className="statLabel">Tỷ lệ chấm công</span>
        </div>
        <span className="statValue">{attendanceRate.toFixed(1)}%</span>
      </div>

      <div className="statItem">
        <div className="statLabelWrapper">
          <WarningOutlined className="statIcon" />
          <span className="statLabel">Đi muộn</span>
        </div>
        <span className="statValue">{lateCount}</span>
      </div>

      {topPerformers && topPerformers.length > 0 && (
        <div className="topSection">
          <h4 className="topTitle">
            <TrophyOutlined className="topIcon" />
            Top phòng ban xuất sắc
          </h4>
          <ol>
            {topPerformers.map((performer, index) => (
              <li key={index}>
                <strong>{performer.name}</strong> ({performer.department}) -{" "}
                {performer.rate.toFixed(1)}%
              </li>
            ))}
          </ol>
        </div>
      )}
    </div>
  );
};

export default SummaryStats;
