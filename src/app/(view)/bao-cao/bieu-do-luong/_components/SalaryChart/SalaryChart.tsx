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
import { DepartmentSalary } from "../../_types/salary.types";
import { formatCurrency } from "../../_utils/mockData";
import "./SalaryChart.scss";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface SalaryChartProps {
  data: DepartmentSalary[];
  loading?: boolean;
}

const SalaryChart: React.FC<SalaryChartProps> = ({ data, loading = false }) => {
  console.log({ data });

  const chartData = {
    labels: data.map((dept) => dept.departmentName),
    datasets: [
      {
        label: "Lương trung bình",
        data: data.map((dept) => dept.averageSalary / 1000000),
        backgroundColor: "rgba(24, 144, 255, 0.8)",
        borderColor: "rgba(24, 144, 255, 1)",
        borderWidth: 1,
        borderRadius: 6,
      },
      {
        label: "Lương OT trung bình",
        data: data.map((dept) => dept.averageOT / 1000000),
        backgroundColor: "rgba(250, 173, 20, 0.8)",
        borderColor: "rgba(250, 173, 20, 1)",
        borderWidth: 1,
        borderRadius: 6,
      },
      {
        label: "Phạt đi muộn trung bình",
        data: data.map((dept) => dept.averageLateFine / 1000000),
        backgroundColor: "rgba(255, 77, 79, 0.8)",
        borderColor: "rgba(255, 77, 79, 1)",
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
      className="salary-chart-card"
      title="Thống kê lương theo phòng ban"
      bordered={false}
      loading={loading}
    >
      <div className="chart-container">
        <Bar data={chartData} options={options} />
      </div>
    </Card>
  );
};

export default SalaryChart;
