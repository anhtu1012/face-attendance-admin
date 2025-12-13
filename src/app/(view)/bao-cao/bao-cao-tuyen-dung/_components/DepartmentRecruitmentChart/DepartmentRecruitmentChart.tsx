/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import { Card } from "antd";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LabelList,
} from "recharts";
import "./DepartmentRecruitmentChart.scss";

interface DepartmentData {
  departmentName: string;
  totalCandidates: number;
  hired: number;
  pending: number;
  successRate: number;
}

interface DepartmentRecruitmentChartProps {
  data: DepartmentData[];
  loading?: boolean;
  title?: string;
}

const DepartmentRecruitmentChart: React.FC<DepartmentRecruitmentChartProps> = ({
  data,
  loading = false,
  title = "Tuyển dụng theo phòng ban",
}) => {
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="custom-tooltip">
          <p className="label">{data.departmentName}</p>
          <p className="detail">
            Tổng ứng viên: <strong>{data.totalCandidates}</strong>
          </p>
          <p className="detail">
            Đã tuyển: <strong>{data.hired}</strong>
          </p>
          <p className="detail">
            Đang chờ: <strong>{data.pending}</strong>
          </p>
          <p className="detail">
            Tỷ lệ thành công: <strong>{data.successRate}%</strong>
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <Card
      className="department-recruitment-chart"
      title={title}
      loading={loading}
      bordered={false}
    >
      <ResponsiveContainer width="100%" height={350}>
        <BarChart
          data={data}
          layout="vertical"
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis type="number" tick={{ fill: "#8c8c8c", fontSize: 12 }} />
          <YAxis
            type="category"
            dataKey="departmentName"
            width={120}
            tick={{ fill: "#8c8c8c", fontSize: 12 }}
          />
          <Tooltip content={<CustomTooltip />} />
          <Bar
            dataKey="hired"
            name="Đã tuyển"
            fill="#52c41a"
            radius={[0, 4, 4, 0]}
          >
            <LabelList
              dataKey="hired"
              position="right"
              style={{ fill: "#52c41a", fontSize: 12 }}
            />
          </Bar>
          <Bar
            dataKey="pending"
            name="Đang chờ"
            fill="#faad14"
            radius={[0, 4, 4, 0]}
          >
            <LabelList
              dataKey="pending"
              position="right"
              style={{ fill: "#faad14", fontSize: 12 }}
            />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </Card>
  );
};

export default DepartmentRecruitmentChart;
