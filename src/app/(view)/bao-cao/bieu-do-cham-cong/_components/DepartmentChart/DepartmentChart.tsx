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
import "./DepartmentChart.scss";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface DepartmentChartProps {
  data: DepartmentStats[];
  loading?: boolean;
}

const DepartmentChart: React.FC<DepartmentChartProps> = ({
  data,
  loading = false,
}) => {
  const chartData = {
    labels: data.map((dept) => dept.departmentName),
    datasets: [
      {
        label: "Có mặt",
        data: data.map((dept) => dept.presentCount),
        backgroundColor: "rgba(82, 196, 26, 0.8)",
        borderColor: "rgba(82, 196, 26, 1)",
        borderWidth: 1,
        borderRadius: 6,
      },
      {
        label: "Vắng mặt",
        data: data.map((dept) => dept.absentCount),
        backgroundColor: "rgba(255, 77, 79, 0.8)",
        borderColor: "rgba(255, 77, 79, 1)",
        borderWidth: 1,
        borderRadius: 6,
      },
      {
        label: "Đi muộn",
        data: data.map((dept) => dept.lateCount),
        backgroundColor: "rgba(250, 173, 20, 0.8)",
        borderColor: "rgba(250, 173, 20, 1)",
        borderWidth: 1,
        borderRadius: 6,
      },
    ],
  };

  const options: ChartOptions<"bar"> = {
    responsive: true,
    maintainAspectRatio: false,
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
            label += context.parsed.y + " người";
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
            return value + " người";
          },
        },
      },
    },
  };

  return (
    <Card
      className="department-chart-card"
      title="Thống kê chấm công theo phòng ban"
      bordered={false}
      loading={loading}
    >
      <div className="chart-container">
        <Bar data={chartData} options={options} />
      </div>
    </Card>
  );
};

export default DepartmentChart;

