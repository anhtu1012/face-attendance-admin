import React, { useState } from "react";
import { Card } from "antd";
import {
  TeamOutlined,
  ApartmentOutlined,
  SafetyOutlined,
  UpOutlined,
  DownOutlined,
} from "@ant-design/icons";
import "./EmployeeStats.scss";

interface DepartmentStat {
  name: string;
  count: number;
  color: string;
}

interface PositionStat {
  name: string;
  count: number;
  color: string;
}

interface EmployeeStatsProps {
  totalEmployees: number;
  departmentStats: DepartmentStat[];
  positionStats: PositionStat[];
  loading?: boolean;
}

const EmployeeStats: React.FC<EmployeeStatsProps> = ({
  totalEmployees,
  departmentStats = [],
  positionStats = [],
  loading = false,
}) => {
  const [isExpanded, setIsExpanded] = useState(true);

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className="employee-stats-container">
      <Card className="stats-card" loading={loading} bordered={false}>
        {/* Total Employees - Compact */}
        <div className="total-section-compact" onClick={toggleExpand}>
          <div className="total-icon-compact">
            <TeamOutlined />
          </div>
          <div className="total-info-compact">
            <div className="total-label-compact">Tổng số nhân viên</div>
            <div className="total-value-compact">{totalEmployees}</div>
          </div>
          <div className="toggle-icon">
            {isExpanded ? <UpOutlined /> : <DownOutlined />}
          </div>
        </div>

        {/* Expandable Stats Sections */}
        {isExpanded && (
          <div className="stats-sections-container">
            {/* Department Stats */}
            <div className="stats-section">
              <div className="section-header">
                <ApartmentOutlined className="section-icon" />
                <span className="section-title">Phân bổ theo Phòng ban</span>
              </div>
              <div className="stats-list">
                {departmentStats.map((dept, index) => (
                  <div key={index} className="stat-item">
                    <div className="stat-bar-container">
                      <div className="stat-label">
                        <span className="stat-name">{dept.name}</span>
                        <span className="stat-count">{dept.count}</span>
                      </div>
                      {/* <div className="stat-bar">
                        <div
                          className="stat-bar-fill"
                          style={{
                            width: `${(dept.count / totalEmployees) * 100}%`,
                            background: dept.color,
                          }}
                        />
                      </div> */}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Position Stats */}
            <div className="stats-section">
              <div className="section-header">
                <SafetyOutlined className="section-icon" />
                <span className="section-title">Phân bổ theo Chức vụ</span>
              </div>
              <div className="stats-list">
                {positionStats.map((position, index) => (
                  <div key={index} className="stat-item">
                    <div className="stat-bar-container">
                      <div className="stat-label">
                        <span className="stat-name">{position.name}</span>
                        <span className="stat-count">{position.count}</span>
                      </div>
                      {/* <div className="stat-bar">
                        <div
                          className="stat-bar-fill"
                          style={{
                            width: `${
                              (position.count / totalEmployees) * 100
                            }%`,
                            background: position.color,
                          }}
                        />
                      </div> */}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
};

export default EmployeeStats;
