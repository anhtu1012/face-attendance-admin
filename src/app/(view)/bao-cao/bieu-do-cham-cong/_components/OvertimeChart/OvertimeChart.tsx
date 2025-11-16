"use client";
import React from "react";
import { Card } from "antd";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ChartOptions,
} from "chart.js";
import { DepartmentStats } from "../../_types/dashboard.types";
import "./OvertimeChart.scss";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface OvertimeChartProps {
  data: DepartmentStats[];
  loading?: boolean;
}

const OvertimeChart: React.FC<OvertimeChartProps> = ({
  data,
  loading = false,
}) => {
  const chartData = {
    labels: data.map((dept) => dept.departmentName),
    datasets: [
      {
        label: "Giờ làm trung bình",
        data: data.map((dept) => dept.averageWorkHours),
        backgroundColor: "rgba(24, 144, 255, 0.8)",
        borderColor: "rgba(24, 144, 255, 1)",
        borderWidth: 1,
        borderRadius: 6,
        yAxisID: "y",
      },
      {
        label: "Giờ tăng ca",
        data: data.map((dept) => dept.overtimeHours),
        backgroundColor: "rgba(250, 140, 22, 0.8)",
        borderColor: "rgba(250, 140, 22, 1)",
        borderWidth: 1,
        borderRadius: 6,
        yAxisID: "y1",
      },
    ],
  };

  const options: ChartOptions<"bar"> = {
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
            if (context.datasetIndex === 0) {
              label += context.parsed.y.toFixed(1) + " giờ";
            } else {
              label += context.parsed.y + " giờ";
            }
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
        type: "linear" as const,
        display: true,
        position: "left" as const,
        beginAtZero: true,
        grid: {
          color: "rgba(0, 0, 0, 0.05)",
        },
        ticks: {
          font: {
            size: 12,
          },
          callback: function (value) {
            return value + " giờ";
          },
        },
        title: {
          display: true,
          text: "Giờ làm trung bình",
          font: {
            size: 12,
            weight: "bold",
          },
        },
      },
      y1: {
        type: "linear" as const,
        display: true,
        position: "right" as const,
        beginAtZero: true,
        grid: {
          drawOnChartArea: false,
        },
        ticks: {
          font: {
            size: 12,
          },
          callback: function (value) {
            return value + " giờ";
          },
        },
        title: {
          display: true,
          text: "Tổng giờ tăng ca",
          font: {
            size: 12,
            weight: "bold",
          },
        },
      },
    },
  };

  return (
    <Card
      className="overtime-chart-card"
      title="Thống kê giờ làm việc và tăng ca"
      bordered={false}
      loading={loading}
    >
      <div className="chart-container">
        <Bar data={chartData} options={options} />
      </div>
    </Card>
  );
};

export default OvertimeChart;

