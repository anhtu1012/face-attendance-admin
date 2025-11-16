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
import { TrendData } from "../../_types/dashboard.types";
import "./TrendChart.scss";

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

interface TrendChartProps {
  data: TrendData[];
  loading?: boolean;
}

const TrendChart: React.FC<TrendChartProps> = ({ data, loading = false }) => {
  const chartData = {
    labels: data.map((item) => item.date),
    datasets: [
      {
        label: "Có mặt",
        data: data.map((item) => item.present),
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
        label: "Vắng mặt",
        data: data.map((item) => item.absent),
        borderColor: "rgb(255, 77, 79)",
        backgroundColor: "rgba(255, 77, 79, 0.1)",
        tension: 0.4,
        fill: true,
        pointRadius: 4,
        pointHoverRadius: 6,
        pointBackgroundColor: "rgb(255, 77, 79)",
        pointBorderColor: "#fff",
        pointBorderWidth: 2,
      },
      {
        label: "Đi muộn",
        data: data.map((item) => item.late),
        borderColor: "rgb(250, 173, 20)",
        backgroundColor: "rgba(250, 173, 20, 0.1)",
        tension: 0.4,
        fill: true,
        pointRadius: 4,
        pointHoverRadius: 6,
        pointBackgroundColor: "rgb(250, 173, 20)",
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
            return value;
          },
        },
      },
    },
  };

  return (
    <Card
      className="trend-chart-card"
      title="Xu hướng chấm công theo thời gian"
      bordered={false}
      loading={loading}
    >
      <div className="chart-container">
        <Line data={chartData} options={options} />
      </div>
    </Card>
  );
};

export default TrendChart;

