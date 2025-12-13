import React from "react";
import { Card } from "antd";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from "recharts";
import "./RecruitmentTrendChart.scss";

interface TrendData {
  date: string;
  month: string;
  newCandidates: number;
  interviewed: number;
  offered: number;
  hired: number;
}

interface RecruitmentTrendChartProps {
  data: TrendData[];
  loading?: boolean;
  title?: string;
}

const COLORS = {
  newCandidates: "#1890ff",
  interviewed: "#722ed1",
  offered: "#faad14",
  hired: "#52c41a",
};

const RecruitmentTrendChart: React.FC<RecruitmentTrendChartProps> = ({
  data,
  loading = false,
  title = "Xu hướng tuyển dụng theo thời gian",
}) => {
  return (
    <Card
      className="recruitment-trend-chart"
      title={title}
      loading={loading}
      bordered={false}
    >
      <ResponsiveContainer width="100%" height={350}>
        <BarChart
          data={data}
          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis
            dataKey="month"
            tick={{ fill: "#8c8c8c", fontSize: 12 }}
            axisLine={{ stroke: "#d9d9d9" }}
          />
          <YAxis
            tick={{ fill: "#8c8c8c", fontSize: 12 }}
            axisLine={{ stroke: "#d9d9d9" }}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "#fff",
              border: "1px solid #d9d9d9",
              borderRadius: "4px",
            }}
            cursor={{ fill: "rgba(0, 0, 0, 0.05)" }}
          />
          <Legend wrapperStyle={{ paddingTop: "20px" }} iconType="circle" />
          <Bar
            dataKey="newCandidates"
            name="Ứng viên mới"
            fill={COLORS.newCandidates}
            radius={[4, 4, 0, 0]}
          />
          <Bar
            dataKey="interviewed"
            name="Đã phỏng vấn"
            fill={COLORS.interviewed}
            radius={[4, 4, 0, 0]}
          />
          <Bar
            dataKey="offered"
            name="Đã offer"
            fill={COLORS.offered}
            radius={[4, 4, 0, 0]}
          />
          <Bar
            dataKey="hired"
            name="Đã tuyển"
            fill={COLORS.hired}
            radius={[4, 4, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </Card>
  );
};

export default RecruitmentTrendChart;
