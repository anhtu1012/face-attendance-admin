/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"
import { selectAuthLogin } from "@/lib/store/slices/loginSlice";
import { NotificationService } from "@/services/notification/notification.service";
import { NotificationItem } from "@/dtos/notification/notification.response.dto";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import {
  Card,
  List,
  Avatar,
  Typography,
  Tag,
  Button,
  Input,
  Space,
  Pagination,
  Empty,
  Spin,
  message,
  Row,
  Col,
  Badge,
  Tooltip,
  Divider
} from "antd";
import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  WarningOutlined,
  InfoCircleOutlined,
  SearchOutlined,
  ReloadOutlined,
  CheckOutlined,
  BellOutlined
} from "@ant-design/icons";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import "dayjs/locale/vi";

// Extend dayjs with plugins
dayjs.extend(relativeTime);
dayjs.locale("vi");

const { Title, Text } = Typography;
const { Search } = Input;

function ViewAllNotification() {
  const [pageSize, setPageSize] = useState<number>(10);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [quickSearch, setQuickSearch] = useState<string>("");
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [total, setTotal] = useState<number>(0);
  const [markingAsRead, setMarkingAsRead] = useState<boolean>(false);
  const [markingOneAsRead, setMarkingOneAsRead] = useState<string>("");

  const authData = useSelector(selectAuthLogin);
  const userCode = authData.userProfile?.code;

  const getData = async (
    page = currentPage,
    limit = pageSize,
    quickkSearch = quickSearch
  ) => {
    if (!userCode) return;

    setLoading(true);
    try {
      const searchOwnweFilter: any = [
        { key: "limit", type: "=", value: limit },
        { key: "offset", type: "=", value: (page - 1) * limit },
      ];

      const result = await NotificationService.getNotifications(
        searchOwnweFilter,
        {
          ...(quickkSearch ? { quickSearch: quickkSearch } : {}),
          userCode: userCode,
        }
      );

      setNotifications(result.data || []);
      setTotal(result.count || 0);
    } catch (error) {
      console.error("Error fetching notifications:", error);
      message.error("Không thể tải danh sách thông báo");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getData();
  }, [userCode]);

  const handleSearch = (value: string) => {
    setQuickSearch(value);
    setCurrentPage(1);
    getData(1, pageSize, value);
  };

  const handlePageChange = (page: number, size?: number) => {
    setCurrentPage(page);
    if (size) setPageSize(size);
    getData(page, size || pageSize, quickSearch);
  };

  const handleRefresh = () => {
    getData(currentPage, pageSize, quickSearch);
  };

  const handleMarkAllAsRead = async () => {
    if (!userCode) return;

    setMarkingAsRead(true);
    try {
      await NotificationService.markAllAsRead(userCode);
      message.success("Đã đánh dấu tất cả thông báo đã đọc");
      // Refresh data
      getData(currentPage, pageSize, quickSearch);
    } catch (error) {
      console.error("Error marking all as read:", error);
      message.error("Không thể đánh dấu đã đọc");
    } finally {
      setMarkingAsRead(false);
    }
  };

  const handleMarkOneAsRead = async (notificationId: string) => {
    setMarkingOneAsRead(notificationId);
    try {
      await NotificationService.markOneRead(notificationId);
      message.success("Đã đánh dấu thông báo đã đọc");
      // Update local state
      setNotifications(prev =>
        prev.map(notif =>
          notif.id === notificationId ? { ...notif, isRead: true } : notif
        )
      );
    } catch (error) {
      console.error("Error marking one as read:", error);
      message.error("Không thể đánh dấu đã đọc");
    } finally {
      setMarkingOneAsRead("");
    }
  };

  const getIcon = (type: string) => {
    const iconStyle = { fontSize: "20px" };

    switch (type) {
      case "SUCCESS":
        return <CheckCircleOutlined style={{ ...iconStyle, color: "#52c41a" }} />;
      case "NOTSUCCESS":
        return <CloseCircleOutlined style={{ ...iconStyle, color: "#ff4d4f" }} />;
      case "WARNING":
        return <WarningOutlined style={{ ...iconStyle, color: "#faad14" }} />;
      case "INFO":
        return <InfoCircleOutlined style={{ ...iconStyle, color: "#1890ff" }} />;
      default:
        return <InfoCircleOutlined style={{ ...iconStyle, color: "#1890ff" }} />;
    }
  };

  const getStatusTag = (type: string) => {
    switch (type) {
      case "SUCCESS":
        return <Tag color="success">Thành công</Tag>;
      case "NOTSUCCESS":
        return <Tag color="error">Thất bại</Tag>;
      case "WARNING":
        return <Tag color="warning">Cảnh báo</Tag>;
      case "INFO":
        return <Tag color="blue">Thông tin</Tag>;
      default:
        return <Tag color="default">Khác</Tag>;
    }
  };

  const getRelativeTime = (dateString: string) => {
    return dayjs(dateString).fromNow();
  };

  const unreadCount = notifications.filter(notif => !notif.isRead).length;

  return (
    <div style={{ padding: "24px" }}>
      {/* Header */}
      <Card style={{ marginBottom: "24px" }}>
        <Row justify="space-between" align="middle">
          <Col>
            <Space align="center">
              <BellOutlined style={{ fontSize: "24px", color: "#1890ff" }} />
              <Title level={2} style={{ margin: 0 }}>
                Tất cả thông báo
              </Title>
              {unreadCount > 0 && (
                <Badge count={unreadCount} style={{ backgroundColor: "#ff4d4f" }} />
              )}
            </Space>
          </Col>
          <Col>
            <Space>
              <Tooltip title="Làm mới">
                <Button
                  type="text"
                  icon={<ReloadOutlined />}
                  onClick={handleRefresh}
                  loading={loading}
                />
              </Tooltip>
              {unreadCount > 0 && (
                <Button
                  type="primary"
                  icon={<CheckOutlined />}
                  onClick={handleMarkAllAsRead}
                  loading={markingAsRead}
                >
                  Đánh dấu tất cả đã đọc
                </Button>
              )}
            </Space>
          </Col>
        </Row>

        <Divider />

        <Row gutter={16} align="middle">
          <Col flex="auto">
            <Search
              placeholder="Tìm kiếm thông báo..."
              allowClear
              enterButton={<SearchOutlined />}
              size="large"
              onSearch={handleSearch}
              style={{ maxWidth: "400px" }}
            />
          </Col>
          <Col>
            <Text type="secondary">
              Tổng cộng: {total} thông báo ({unreadCount} chưa đọc)
            </Text>
          </Col>
        </Row>
      </Card>

      {/* Notifications List */}
      <Card>
        <Spin spinning={loading}>
          {notifications.length > 0 ? (
            <List
              dataSource={notifications}
              renderItem={(notification) => (
                <List.Item
                  key={notification.id}
                  style={{
                    backgroundColor: notification.isRead ? "transparent" : "#f0f9ff",
                    borderRadius: "8px",
                    marginBottom: "8px",
                    padding: "16px",
                    border: notification.isRead ? "1px solid #f0f0f0" : "1px solid #e6f7ff",
                    transition: "all 0.2s ease"
                  }}
                  actions={[
                    !notification.isRead && (
                      <Tooltip title="Đánh dấu đã đọc">
                        <Button
                          type="text"
                          size="small"
                          icon={<CheckOutlined />}
                          onClick={() => handleMarkOneAsRead(notification.id)}
                          loading={markingOneAsRead === notification.id}
                        />
                      </Tooltip>
                    ),
                  ].filter(Boolean)}
                >
                  <List.Item.Meta
                    avatar={
                      <Badge dot={!notification.isRead}>
                        <Avatar
                          icon={getIcon(notification.type)}
                          style={{
                            backgroundColor: "transparent",
                            border: "none"
                          }}
                          size="large"
                        />
                      </Badge>
                    }
                    title={
                      <Space size="middle">
                        <Text
                          strong={!notification.isRead}
                          style={{
                            fontSize: "16px",
                            color: notification.isRead ? "#595959" : "#262626"
                          }}
                        >
                          {notification.title}
                        </Text>
                        {getStatusTag(notification.type)}
                      </Space>
                    }
                    description={
                      <div>
                        <Text
                          style={{
                            fontSize: "14px",
                            color: "#8c8c8c",
                            lineHeight: "1.5",
                            display: "block",
                            marginBottom: "8px"
                          }}
                        >
                          {notification.message}
                        </Text>
                        <Space split={<Divider type="vertical" />}>
                          <Text type="secondary" style={{ fontSize: "12px" }}>
                            {getRelativeTime(notification.createdAt)}
                          </Text>
                          <Text type="secondary" style={{ fontSize: "12px" }}>
                            {dayjs(notification.createdAt).format("DD/MM/YYYY HH:mm")}
                          </Text>
                          {!notification.isRead && (
                            <Text style={{ fontSize: "12px", color: "#1890ff" }}>
                              Chưa đọc
                            </Text>
                          )}
                        </Space>
                      </div>
                    }
                  />
                </List.Item>
              )}
            />
          ) : (
            <Empty
              description="Không có thông báo nào"
              style={{ padding: "40px 0" }}
              styles={{ image: { height: 60 } }}
            />
          )}
        </Spin>

        {/* Pagination */}
        {total > 0 && (
          <div style={{ marginTop: "24px", textAlign: "center" }}>
            <Pagination
              current={currentPage}
              total={total}
              pageSize={pageSize}
              showSizeChanger
              showQuickJumper
              showTotal={(total, range) =>
                `${range[0]}-${range[1]} của ${total} thông báo`
              }
              onChange={handlePageChange}
              pageSizeOptions={["10", "20", "50", "100"]}
            />
          </div>
        )}
      </Card>
    </div>
  );
}

export default ViewAllNotification;
