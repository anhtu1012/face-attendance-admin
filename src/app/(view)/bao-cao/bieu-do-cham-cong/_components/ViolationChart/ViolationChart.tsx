"use client";
import React from "react";
import { Card, Row, Col } from "antd";
import { Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  ChartOptions,
} from "chart.js";
import { ViolationStats } from "../../_types/dashboard.types";
import "./ViolationChart.scss";

ChartJS.register(ArcElement, Tooltip, Legend);

interface ViolationChartProps {
  data: ViolationStats;
  loading?: boolean;
}

const ViolationChart: React.FC<ViolationChartProps> = ({
  data,
  loading = false,
}) => {
  const chartData = {
    labels: ["Đi muộn", "Về sớm", "Quên chấm công", "Vắng mặt"],
    datasets: [
      {
        data: [
          data.lateCount,
          data.earlyLeaveCount,
          data.forgetCheckInCount,
          data.absentCount,
        ],
        backgroundColor: [
          "rgba(250, 173, 20, 0.8)",
          "rgba(24, 144, 255, 0.8)",
          "rgba(114, 46, 209, 0.8)",
          "rgba(255, 77, 79, 0.8)",
        ],
        borderColor: [
          "rgba(250, 173, 20, 1)",
          "rgba(24, 144, 255, 1)",
          "rgba(114, 46, 209, 1)",
          "rgba(255, 77, 79, 1)",
        ],
        borderWidth: 2,
      },
    ],
  };

  const options: ChartOptions<"doughnut"> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "right" as const,
        labels: {
          usePointStyle: true,
          padding: 15,
          font: {
            size: 13,
            family: "'Inter', sans-serif",
          },
          generateLabels: (chart) => {
            const data = chart.data;
            if (data.labels && data.datasets.length) {
              return data.labels.map((label, i) => {
                const value = data.datasets[0].data[i];
                const background = data.datasets[0].backgroundColor;
                let fillStyle:
                  | string
                  | CanvasGradient
                  | CanvasPattern
                  | undefined;
                if (Array.isArray(background)) {
                  const v = background[i];
                  fillStyle = typeof v === "string" ? v : undefined;
                } else if (typeof background === "string") {
                  fillStyle = background;
                } else {
                  fillStyle = undefined;
                }
                return {
                  text: `${label}: ${value} lần`,
                  fillStyle,
                  hidden: false,
                  index: i,
                };
              });
            }
            return [];
          },
        },
      },
      tooltip: {
        backgroundColor: "rgba(0, 0, 0, 0.8)",
        padding: 12,
        titleFont: {
          size: 14,
          weight: "bold",
        },
        bodyFont: {
          size: 13,
        },
        cornerRadius: 8,
        displayColors: true,
        callbacks: {
          label: function (context) {
            const label = context.label || "";
            const value = context.parsed || 0;
            const total = context.dataset.data.reduce(
              (acc: number, val) => acc + (val as number),
              0
            );
            const percentage = ((value / total) * 100).toFixed(1);
            return `${label}: ${value} lần (${percentage}%)`;
          },
        },
      },
    },
  };

  const totalViolations =
    data.lateCount +
    data.earlyLeaveCount +
    data.forgetCheckInCount +
    data.absentCount;

  return (
    <Card
      className="violation-chart-card"
      title="Thống kê vi phạm chấm công"
      bordered={false}
      loading={loading}
    >
      <Row gutter={[16, 16]}>
        <Col span={24}>
          <div className="chart-container">
            <Doughnut data={chartData} options={options} />
          </div>
        </Col>
        <Col span={24}>
          <div className="violation-summary">
            <div className="summary-item">
              <span className="summary-label">Tổng số vi phạm:</span>
              <span className="summary-value total">{totalViolations} lần</span>
            </div>
            <div className="summary-grid">
              <div className="summary-item">
                <div className="color-indicator late"></div>
                <span className="summary-label">Đi muộn:</span>
                <span className="summary-value">{data.lateCount} lần</span>
              </div>
              <div className="summary-item">
                <div className="color-indicator early"></div>
                <span className="summary-label">Về sớm:</span>
                <span className="summary-value">
                  {data.earlyLeaveCount} lần
                </span>
              </div>
              <div className="summary-item">
                <div className="color-indicator forget"></div>
                <span className="summary-label">Quên chấm công:</span>
                <span className="summary-value">
                  {data.forgetCheckInCount} lần
                </span>
              </div>
              <div className="summary-item">
                <div className="color-indicator absent"></div>
                <span className="summary-label">Vắng mặt:</span>
                <span className="summary-value">{data.absentCount} lần</span>
              </div>
            </div>
          </div>
        </Col>
      </Row>
    </Card>
  );
};

export default ViolationChart;
