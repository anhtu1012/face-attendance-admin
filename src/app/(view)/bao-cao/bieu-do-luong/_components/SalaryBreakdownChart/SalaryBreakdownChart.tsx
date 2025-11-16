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
import { SalaryBreakdown } from "../../_types/salary.types";
import { formatCurrency } from "../../_utils/mockData";
import "./SalaryBreakdownChart.scss";

ChartJS.register(ArcElement, Tooltip, Legend);

interface SalaryBreakdownChartProps {
  data: SalaryBreakdown;
  loading?: boolean;
}

const SalaryBreakdownChart: React.FC<SalaryBreakdownChartProps> = ({
  data,
  loading = false,
}) => {
  const chartData = {
    labels: ["Lương cơ bản", "Thưởng", "Tăng ca", "BHXH", "Thuế", "Khấu trừ"],
    datasets: [
      {
        data: [
          data.baseSalaryTotal,
          data.bonusTotal,
          data.overtimeTotal,
          data.socialInsuranceTotal,
          data.taxTotal,
          data.deductionTotal,
        ],
        backgroundColor: [
          "rgba(24, 144, 255, 0.8)",
          "rgba(82, 196, 26, 0.8)",
          "rgba(250, 173, 20, 0.8)",
          "rgba(114, 46, 209, 0.8)",
          "rgba(235, 47, 150, 0.8)",
          "rgba(255, 77, 79, 0.8)",
        ],
        borderColor: [
          "rgba(24, 144, 255, 1)",
          "rgba(82, 196, 26, 1)",
          "rgba(250, 173, 20, 1)",
          "rgba(114, 46, 209, 1)",
          "rgba(235, 47, 150, 1)",
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
          padding: 12,
          font: {
            size: 12,
            family: "'Inter', sans-serif",
          },
          generateLabels: (chart) => {
            const data = chart.data;
            if (data.labels && data.datasets.length) {
              const bg = data.datasets[0].backgroundColor;
              return data.labels.map((label, i) => {
                const value = data.datasets[0].data[i];
                let fill: string;
                if (Array.isArray(bg)) {
                  fill = bg[i] as string;
                } else {
                  fill = (bg as string) || "";
                }
                return {
                  text: `${label}: ${formatCurrency(value as number)}`,
                  fillStyle: fill,
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
            return `${label}: ${formatCurrency(value)} (${percentage}%)`;
          },
        },
      },
    },
  };

  return (
    <Card
      className="salary-breakdown-chart-card"
      title="Cơ cấu lương và chi phí"
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
          <div className="breakdown-summary">
            <div className="summary-grid">
              <div className="summary-item">
                <div className="color-indicator base-salary"></div>
                <div className="summary-content">
                  <span className="summary-label">Lương cơ bản</span>
                  <span className="summary-value">
                    {formatCurrency(data.baseSalaryTotal)}
                  </span>
                </div>
              </div>
              <div className="summary-item">
                <div className="color-indicator bonus"></div>
                <div className="summary-content">
                  <span className="summary-label">Thưởng</span>
                  <span className="summary-value">
                    {formatCurrency(data.bonusTotal)}
                  </span>
                </div>
              </div>
              <div className="summary-item">
                <div className="color-indicator overtime"></div>
                <div className="summary-content">
                  <span className="summary-label">Tăng ca</span>
                  <span className="summary-value">
                    {formatCurrency(data.overtimeTotal)}
                  </span>
                </div>
              </div>
              <div className="summary-item">
                <div className="color-indicator insurance"></div>
                <div className="summary-content">
                  <span className="summary-label">BHXH</span>
                  <span className="summary-value">
                    {formatCurrency(data.socialInsuranceTotal)}
                  </span>
                </div>
              </div>
              <div className="summary-item">
                <div className="color-indicator tax"></div>
                <div className="summary-content">
                  <span className="summary-label">Thuế</span>
                  <span className="summary-value">
                    {formatCurrency(data.taxTotal)}
                  </span>
                </div>
              </div>
              <div className="summary-item">
                <div className="color-indicator deduction"></div>
                <div className="summary-content">
                  <span className="summary-label">Khấu trừ</span>
                  <span className="summary-value">
                    {formatCurrency(data.deductionTotal)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </Col>
      </Row>
    </Card>
  );
};

export default SalaryBreakdownChart;
