"use client";

import { Card, Col, Row, Statistic, Table, Typography } from "antd";
import { EyeOutlined, FormOutlined, UserOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";

const { Title } = Typography;

interface AnalyticsData {
  totalVisits: number;
  totalApplications: number;
  totalUsers: number;
  topPages: Array<{
    page: string;
    views: number;
    applications: number;
  }>;
}

export default function AnalyticsDashboard() {
  const [data, setData] = useState<AnalyticsData>({
    totalVisits: 0,
    totalApplications: 0,
    totalUsers: 0,
    topPages: [],
  });

  useEffect(() => {
    // Mock data - In real app, you would fetch from Google Analytics API
    const mockData: AnalyticsData = {
      totalVisits: 1247,
      totalApplications: 89,
      totalUsers: 756,
      topPages: [
        {
          page: "/apply/senior-frontend-dev",
          views: 245,
          applications: 32,
        },
        {
          page: "/apply/backend-developer",
          views: 189,
          applications: 24,
        },
        {
          page: "/apply/ui-ux-designer",
          views: 156,
          applications: 18,
        },
        {
          page: "/apply/project-manager",
          views: 134,
          applications: 15,
        },
      ],
    };

    setData(mockData);
  }, []);

  const columns = [
    {
      title: "Trang",
      dataIndex: "page",
      key: "page",
      render: (page: string) => (
        <span style={{ fontFamily: "monospace" }}>{page}</span>
      ),
    },
    {
      title: "Lượt xem",
      dataIndex: "views",
      key: "views",
      render: (views: number) => views.toLocaleString(),
    },
    {
      title: "Đơn ứng tuyển",
      dataIndex: "applications",
      key: "applications",
      render: (applications: number) => applications.toLocaleString(),
    },
    {
      title: "Tỷ lệ chuyển đổi",
      key: "conversion",
      render: (record: { views: number; applications: number }) => {
        const rate = ((record.applications / record.views) * 100).toFixed(1);
        return `${rate}%`;
      },
    },
  ];

  return (
    <div style={{ padding: "24px" }}>
      <Title level={2}>Thống kê truy cập website</Title>

      <Row gutter={16} style={{ marginBottom: "24px" }}>
        <Col span={8}>
          <Card>
            <Statistic
              title="Tổng lượt truy cập"
              value={data.totalVisits}
              prefix={<EyeOutlined />}
              valueStyle={{ color: "#1890ff" }}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic
              title="Tổng đơn ứng tuyển"
              value={data.totalApplications}
              prefix={<FormOutlined />}
              valueStyle={{ color: "#52c41a" }}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic
              title="Số người dùng"
              value={data.totalUsers}
              prefix={<UserOutlined />}
              valueStyle={{ color: "#722ed1" }}
            />
          </Card>
        </Col>
      </Row>

      <Card
        title="Thống kê theo trang ứng tuyển"
        style={{ marginBottom: "24px" }}
      >
        <Table
          dataSource={data.topPages}
          columns={columns}
          pagination={false}
          rowKey="page"
        />
      </Card>

      <Card title="Hướng dẫn xem thống kê chi tiết">
        <div style={{ lineHeight: "1.8" }}>
          <p>
            <strong>Để xem thống kê chi tiết từ Google Analytics:</strong>
          </p>
          <ol>
            <li>
              Truy cập{" "}
              <a
                href="https://analytics.google.com/"
                target="_blank"
                rel="noopener noreferrer"
              >
                Google Analytics
              </a>
            </li>
            <li>Chọn property tương ứng với website của bạn</li>
            <li>
              Vào mục <strong>Reports</strong> → <strong>Engagement</strong> →{" "}
              <strong>Pages and screens</strong>
            </li>
            <li>
              Lọc theo URL cụ thể bằng cách thêm filter:{" "}
              <code>page_path contains &quot;/apply/&quot;</code>
            </li>
            <li>
              Xem các metrics như Page views, Users, Average engagement time
            </li>
          </ol>
          <p>
            <strong>Tracking ID hiện tại:</strong>{" "}
            <code>
              {process.env.NEXT_PUBLIC_GA_TRACKING_ID || "Chưa được cấu hình"}
            </code>
          </p>
          <p>
            <em>
              Lưu ý: Thay thế tracking ID trong file .env.local để bắt đầu thu
              thập dữ liệu thực.
            </em>
          </p>
        </div>
      </Card>
    </div>
  );
}
