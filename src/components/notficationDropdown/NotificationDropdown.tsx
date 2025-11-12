import { NotificationItem } from "@/dtos/notification/notification.response.dto";
import useSocket from "@/hooks/useSocket";
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
  App,
  Avatar,
  Badge,
  Button,
  Card,
  Drawer,
  Empty,
  Space,
  Spin,
  Typography,
} from "antd";
import dayjs from "dayjs";
import "dayjs/locale/vi";
import relativeTime from "dayjs/plugin/relativeTime";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import "./NotificationDropdown.scss";

// Extend dayjs with plugins
dayjs.extend(relativeTime);
dayjs.locale("vi");

const { Text, Title } = Typography;

interface NotificationDropdownProps {
  placement?: "bottomLeft" | "bottomRight" | "topLeft" | "topRight";
}

const NotificationDropdown: React.FC<NotificationDropdownProps> = () => {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [markingAsRead, setMarkingAsRead] = useState(false);
  const socket = useSocket();
  const { message } = App.useApp();

  // Get user data from Redux
  const authData = useSelector(selectAuthLogin);
  const userId = authData.userProfile?.id;

  const unreadCount = notifications.filter((notif) => !notif.isRead).length;

  // Fetch notifications when component mounts or when dropdown opens
  const fetchNotifications = async () => {
    if (!userId) return;

    setLoading(true);
    try {
      const response = await NotificationService.getMyNotification(
        String(userId)
      );

      setNotifications(response.data?.reverse() || []);
    } catch (error) {
      console.error("Error fetching notifications:", error);
      message.error("Không thể tải thông báo");
    } finally {
      setLoading(false);
    }
  };

  // Fetch notifications immediately when userId  is available
  useEffect(() => {
    if (userId) {
      fetchNotifications();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId, socket]);

  // Listen for new notifications from WebSocket
  useEffect(() => {
    if (!socket) return;

    const handleNewNotification = (notification: NotificationItem) => {
      console.log("notification", notification);

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
    // Listen for notifications with dynamic key using userId
    // const notificationKey = `NOTIFICATION_CREATED_${userId }`;
    socket.on("NOTIFICATION_SENT", handleNewNotification);

    return () => {
      socket.off("NOTIFICATION_SENT", handleNewNotification);
    };
  }, [socket, userId]);

  // Refresh notifications when drawer opens for latest data
  useEffect(() => {
    if (userId && visible) {
      fetchNotifications();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
  // const getRelativeTime = (dateString: string) => {
  //   return dayjs(dateString).fromNow();
  // };

  const handleMarkAllAsRead = async () => {
    if (!userId) return;

    setMarkingAsRead(true);
    try {
      await NotificationService.markAllAsRead(String(userId));
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

  const renderNotificationItem = (notification: NotificationItem) => (
    <Card
      key={notification.id}
      className={`notification-card ${!notification.isRead ? "unread" : ""}`}
      onClick={() => handleReadOneNoti(notification)}
      hoverable
    >
      <div className="notification-card-content">
        <div className="notification-icon">
          <Avatar
            icon={getIcon(notification.type)}
            style={{
              backgroundColor: "transparent",
              border: "none",
            }}
            size={40}
          />
        </div>
        <div className="notification-body">
          <div className="notification-header">
            <Text
              strong={!notification.isRead}
              className="notification-title"
              ellipsis={{ tooltip: notification.title }}
            >
              {notification.title}
            </Text>
            {!notification.isRead && <div className="unread-dot" />}
          </div>
          <Text
            className="notification-message"
            ellipsis={{ tooltip: notification.description }}
          >
            {notification.description}
          </Text>
          <Text type="secondary" className="notification-time">
            {dayjs(notification.createdAt).format("HH:mm DD/MM/YYYY")}
          </Text>
        </div>
      </div>
    </Card>
  );

  return (
    <>
      <Badge
        count={unreadCount}
        overflowCount={99}
        size="small"
        className={unreadCount > 0 ? "notification-badge-pulse" : ""}
      >
        <Button
          type="text"
          icon={<BellOutlined />}
          onClick={() => setVisible(true)}
          className="notification-bell-button"
        />
      </Badge>

      <Drawer
        title={
          <div className="notification-drawer-header">
            <Space align="center">
              <Title level={4} style={{ margin: 0 }}>
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
                onClick={handleMarkAllAsRead}
                loading={markingAsRead}
                className="mark-all-read-btn"
              >
                Đánh dấu tất cả đã đọc
              </Button>
            )}
          </div>
        }
        placement="right"
        width={450}
        open={visible}
        onClose={() => setVisible(false)}
        className="notification-drawer"
        footer={
          <div className="notification-drawer-footer">
            <Button
              type="primary"
              onClick={fetchNotifications}
              block
              size="large"
            >
              Tải lại thông báo
            </Button>
            <Button type="dashed" block size="large">
              Xóa tất cả thông báo
            </Button>
          </div>
        }
      >
        {loading ? (
          <div className="notification-loading">
            <Spin size="large" />
            <div className="loading-text">Đang tải thông báo...</div>
          </div>
        ) : notifications.length > 0 ? (
          <div className="notification-list">
            {notifications.map(renderNotificationItem)}
          </div>
        ) : (
          <Empty
            description="Không có thông báo nào"
            className="notification-empty"
          />
        )}
      </Drawer>
    </>
  );
};

export default NotificationDropdown;
