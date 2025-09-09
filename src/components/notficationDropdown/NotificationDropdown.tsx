/* eslint-disable @typescript-eslint/no-explicit-any */
import { NotificationItem } from "@/dtos/notification/notification.response.dto";
import useSocket from "@/hook/useSocket";
import { selectAuthLogin } from "@/lib/store/slices/loginSlice";
import { NotificationService } from "@/services/notification/notification.service";
import {
  BellOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  InfoCircleOutlined,
  WarningOutlined,
} from "@ant-design/icons";
import {
  Avatar,
  Badge,
  Button,
  Dropdown,
  Empty,
  List,
  Space,
  Spin,
  Typography,
  message,
} from "antd";
import dayjs from "dayjs";
import "dayjs/locale/vi";
import relativeTime from "dayjs/plugin/relativeTime";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";

// Extend dayjs with plugins
dayjs.extend(relativeTime);
dayjs.locale("vi");

const { Text, Title } = Typography;

interface NotificationDropdownProps {
  placement?: "bottomLeft" | "bottomRight" | "topLeft" | "topRight";
}

const NotificationDropdown: React.FC<NotificationDropdownProps> = ({
  placement = "bottomRight",
}) => {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [markingAsRead, setMarkingAsRead] = useState(false);
  const socket = useSocket();

  // Get user data from Redux
  const authData = useSelector(selectAuthLogin);
  const userCode = authData.userProfile?.code;

  const unreadCount = notifications.filter((notif) => !notif.isRead).length;

  // Fetch notifications when component mounts or when dropdown opens
  const fetchNotifications = async () => {
    if (!userCode) return;

    setLoading(true);
    try {
      const response = await NotificationService.getMyNotification(userCode);

      setNotifications(response.data?.reverse() || []);
    } catch (error) {
      console.error("Error fetching notifications:", error);
      message.error("Không thể tải thông báo");
    } finally {
      setLoading(false);
    }
  };

  // Fetch notifications immediately when userCode is available
  useEffect(() => {
    if (userCode) {
      fetchNotifications();
    }
  }, [userCode, socket]);

  // Listen for new notifications from WebSocket
  useEffect(() => {
    if (!socket) return;

    const handleNewNotification = (notification: NotificationItem) => {
      toast.info(notification.title, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      setNotifications((prev) => [notification, ...prev]);
    };
    // Listen for notifications with dynamic key using userCode
    const notificationKey = `NOTIFICATION_CREATED_${userCode}`;
    socket.on(notificationKey, handleNewNotification);

    return () => {
      socket.off(notificationKey, handleNewNotification);
    };
  }, [socket, userCode]);

  // Refresh notifications when dropdown opens for latest data
  useEffect(() => {
    if (userCode && visible) {
      fetchNotifications();
    }
  }, [visible]);

  const getIcon = (type: string) => {
    const iconStyle = { fontSize: "16px" };

    switch (type) {
      case "SUCCESS":
        return (
          <CheckCircleOutlined style={{ ...iconStyle, color: "#52c41a" }} />
        );
      case "NOTSUCCESS":
        return (
          <CloseCircleOutlined style={{ ...iconStyle, color: "#ff4d4f" }} />
        );
      case "WARNING":
        return <WarningOutlined style={{ ...iconStyle, color: "#faad14" }} />;
      case "INFO":
        return (
          <InfoCircleOutlined style={{ ...iconStyle, color: "#1890ff" }} />
        );
      default:
        return (
          <InfoCircleOutlined style={{ ...iconStyle, color: "#1890ff" }} />
        );
    }
  };
  const handleReadOneNoti = async (noti: NotificationItem) => {
    if (noti.isRead) return;

    try {
      await NotificationService.markOneRead(noti.id);
      await fetchNotifications();
    } catch (error) {
      console.error("Error marking notifications as read:", error);
    }
  };
  const getRelativeTime = (dateString: string) => {
    return dayjs(dateString).fromNow();
  };

  const handleMarkAllAsRead = async () => {
    if (!userCode) return;

    setMarkingAsRead(true);
    try {
      await NotificationService.markAllAsRead(userCode);
      // message.success('Đã đánh dấu tất cả thông báo đã đọc');
      // Refresh notifications
      await fetchNotifications();
    } catch (error) {
      console.error("Error marking notifications as read:", error);
      message.error("Không thể đánh dấu đã đọc");
    } finally {
      setMarkingAsRead(false);
    }
  };

  const getLinkNoti = (roleCode: string) => {
    switch (roleCode) {
      case "R2":
        return "/hr/thong-bao";
      case "R3":
        return "/manager/thong-bao";
      case "R1":
        return "/admin/thong-bao";
      default:
        break;
    }
    return "#";
  };
  const renderNotificationItem = (notification: NotificationItem) => (
    <List.Item
      key={notification.id}
      style={{
        backgroundColor: notification.isRead ? "transparent" : "#f0f9ff",
        borderRadius: "6px",
        marginBottom: "4px",
        padding: "8px 12px",
        border: notification.isRead ? "none" : "1px solid #e6f7ff",
        cursor: "pointer",
        transition: "all 0.2s ease",
      }}
      onClick={() => handleReadOneNoti(notification)}
    >
      <List.Item.Meta
        avatar={
          <Avatar
            icon={getIcon(notification.type)}
            style={{
              backgroundColor: "transparent",
              border: "none",
            }}
            size="small"
          />
        }
        title={
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
            }}
          >
            <Text
              strong={!notification.isRead}
              style={{
                fontSize: "13px",
                fontWeight: notification.isRead ? "normal" : "600",
                color: notification.isRead ? "#595959" : "#262626",
                lineHeight: "1.3",
                maxWidth: "200px",
              }}
              ellipsis={{ tooltip: notification.title }}
            >
              {notification.title}
            </Text>
            {!notification.isRead && (
              <div
                style={{
                  width: "6px",
                  height: "6px",
                  backgroundColor: "#1890ff",
                  borderRadius: "50%",
                  marginLeft: "8px",
                  flexShrink: 0,
                  marginTop: "2px",
                }}
              />
            )}
          </div>
        }
        description={
          <div>
            <Text
              style={{
                fontSize: "12px",
                color: "#8c8c8c",
                lineHeight: "1.4",
                display: "block",
                marginBottom: "4px",
              }}
              ellipsis={{ tooltip: notification.message }}
            >
              {notification.message}
            </Text>
            <Text
              type="secondary"
              style={{
                fontSize: "11px",
                fontStyle: "italic",
              }}
            >
              {getRelativeTime(notification.createdAt)}
            </Text>
          </div>
        }
      />
    </List.Item>
  );

  const dropdownContent = (
    <div
      style={{
        width: "320px",
        maxHeight: "400px",
        backgroundColor: "#fff",
        borderRadius: "8px",
        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
        border: "1px solid #f0f0f0",
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: "12px 16px",
          borderBottom: "1px solid #f0f0f0",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Space align="center">
          <Title level={5} style={{ margin: 0, fontSize: "14px" }}>
            Thông báo
          </Title>
          {unreadCount > 0 && (
            <Badge
              count={unreadCount}
              size="small"
              style={{ backgroundColor: "#ff4d4f" }}
            />
          )}
        </Space>

        {unreadCount > 0 && (
          <Button
            type="link"
            size="small"
            onClick={handleMarkAllAsRead}
            loading={markingAsRead}
            style={{ fontSize: "11px", padding: "0 4px" }}
          >
            Đánh dấu tất cả đã đọc
          </Button>
        )}
      </div>

      {/* Notifications List */}
      <div
        style={{
          maxHeight: "280px",
          overflowY: "auto",
          padding: "8px",
        }}
      >
        {loading ? (
          <div style={{ textAlign: "center", padding: "20px 0" }}>
            <Spin size="small" />
            <div style={{ marginTop: 8, fontSize: "12px", color: "#8c8c8c" }}>
              Đang tải thông báo...
            </div>
          </div>
        ) : notifications.length > 0 ? (
          <List
            dataSource={notifications.slice(0, 5)} // Show only first 5 notifications
            renderItem={renderNotificationItem}
            style={{ margin: 0 }}
            split={false}
          />
        ) : (
          <Empty
            description="Không có thông báo nào"
            style={{ padding: "20px 0" }}
            styles={{ image: { height: 40 } }}
          />
        )}
      </div>

      {/* Footer */}
      <div
        style={{
          padding: "8px 16px",
          borderTop: "1px solid #f0f0f0",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Link
          href={getLinkNoti(authData.userProfile?.roleCode || "")}
          style={{ textDecoration: "none" }}
        >
          <Button
            type="text"
            size="small"
            style={{ fontSize: "12px", color: "#1890ff" }}
          >
            Xem tất cả
          </Button>
        </Link>
      </div>
    </div>
  );

  return (
    <Dropdown
      dropdownRender={() => dropdownContent}
      placement={placement}
      trigger={["click"]}
      open={visible}
      onOpenChange={setVisible}
      overlayStyle={{ zIndex: 1050 }}
    >
      <Badge
        count={unreadCount}
        overflowCount={99}
        size="small"
        style={{ backgroundColor: "#ff4d4f" }}
      >
        <Button
          type="text"
          icon={<BellOutlined />}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            height: "40px",
            width: "40px",
            borderRadius: "8px",
            transition: "all 0.2s ease",
          }}
          className="icon-button help-button"
        />
      </Badge>
    </Dropdown>
  );
};

export default NotificationDropdown;
