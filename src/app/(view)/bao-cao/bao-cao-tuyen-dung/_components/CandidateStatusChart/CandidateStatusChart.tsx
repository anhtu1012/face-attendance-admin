/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import { Card } from "antd";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from "recharts";
import "./CandidateStatusChart.scss";

interface StatusData {
  name: string;
  value: number;
  color: string;
}

interface CandidateStatusChartProps {
  data: StatusData[];
  loading?: boolean;
  title?: string;
}

const CandidateStatusChart: React.FC<CandidateStatusChartProps> = ({
  data,
  loading = false,
  title = "Phân bố ứng viên theo trạng thái",
}) => {
  const renderLabel = (entry: any) => {
    const percent = ((entry.value / entry.payload.total) * 100).toFixed(1);
    return `${percent}%`;
  };

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="custom-tooltip">
          <p className="label">{payload[0].name}</p>
          <p className="value">
            Số lượng: <strong>{payload[0].value}</strong>
          </p>
        </div>
      );
    }
    return null;
  };

  const total = data.reduce((sum, item) => sum + item.value, 0);
  const dataWithTotal = data.map((item) => ({ ...item, total }));

  return (
    <Card
      className="candidate-status-chart"
      title={title}
      loading={loading}
      bordered={false}
    >
      <ResponsiveContainer width="100%" height={350}>
        <PieChart>
          <Pie
            data={dataWithTotal}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={renderLabel}
            outerRadius={120}
            fill="#8884d8"
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend
            verticalAlign="bottom"
            height={36}
            iconType="circle"
            formatter={(value, entry: any) => (
              <span style={{ color: "#595959" }}>
                {value} ({entry.payload.value})
              </span>
            )}
          />
        </PieChart>
      </ResponsiveContainer>
    </Card>
  );
};

export default CandidateStatusChart;
