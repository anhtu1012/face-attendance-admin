"use client";
import React from "react";
import { Card } from "antd";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  ChartOptions,
} from "chart.js";
import { SalaryTrendData } from "../../_types/salary.types";
import { formatCurrency } from "../../_utils/mockData";
import "./SalaryTrendChart.scss";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface SalaryTrendChartProps {
  data: SalaryTrendData[];
  loading?: boolean;
}

const SalaryTrendChart: React.FC<SalaryTrendChartProps> = ({
  data,
  loading = false,
}) => {
  const chartData = {
    labels: data.map((item) => item.month),
    datasets: [
      {
        label: "Tổng lương",
        data: data.map((item) => item.totalSalary / 1000000),
        borderColor: "rgb(24, 144, 255)",
        backgroundColor: "rgba(24, 144, 255, 0.1)",
        tension: 0.4,
        fill: true,
        pointRadius: 4,
        pointHoverRadius: 6,
        pointBackgroundColor: "rgb(24, 144, 255)",
        pointBorderColor: "#fff",
        pointBorderWidth: 2,
      },
      {
        label: "Thưởng",
        data: data.map((item) => item.totalBonus / 1000000),
        borderColor: "rgb(82, 196, 26)",
        backgroundColor: "rgba(82, 196, 26, 0.1)",
        tension: 0.4,
        fill: true,
        pointRadius: 4,
        pointHoverRadius: 6,
        pointBackgroundColor: "rgb(82, 196, 26)",
        pointBorderColor: "#fff",
        pointBorderWidth: 2,
      },
      {
        label: "Lương thực nhận",
        data: data.map((item) => item.netSalary / 1000000),
        borderColor: "rgb(114, 46, 209)",
        backgroundColor: "rgba(114, 46, 209, 0.1)",
        tension: 0.4,
        fill: true,
        pointRadius: 4,
        pointHoverRadius: 6,
        pointBackgroundColor: "rgb(114, 46, 209)",
        pointBorderColor: "#fff",
        pointBorderWidth: 2,
      },
    ],
  };

  const options: ChartOptions<"line"> = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: "index" as const,
      intersect: false,
    },
    plugins: {
      legend: {
        position: "top" as const,
        labels: {
          usePointStyle: true,
          padding: 15,
          font: {
            size: 13,
            family: "'Inter', sans-serif",
          },
        },
      },
      title: {
        display: false,
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
            let label = context.dataset.label || "";
            if (label) {
              label += ": ";
            }
            const value = context.parsed.y * 1000000;
            label += formatCurrency(value);
            return label;
          },
        },
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          font: {
            size: 12,
          },
        },
      },
      y: {
        beginAtZero: true,
        grid: {
          color: "rgba(0, 0, 0, 0.05)",
        },
        ticks: {
          font: {
            size: 12,
          },
          callback: function (value) {
            return value + " triệu";
          },
        },
      },
    },
  };

  return (
    <Card
      className="salary-trend-chart-card"
      title="Xu hướng lương theo thời gian"
      bordered={false}
      loading={loading}
    >
      <div className="chart-container">
        <Line data={chartData} options={options} />
      </div>
    </Card>
  );
};

export default SalaryTrendChart;

