/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import { List, Typography, Space, Button, Avatar } from 'antd';
import { 
  CheckCircleOutlined, 
  WarningOutlined, 
  InfoCircleOutlined,
  EyeOutlined
} from '@ant-design/icons';

const { Text } = Typography;

interface NotificationProps {
  notification: {
    id: number;
    title: string;
    message: string;
    type: string;
    time: string;
    isRead: boolean;
    icon: string;
  };
  onMarkAsRead: (id: number) => void;
}

const NotificationCard: React.FC<NotificationProps> = ({ notification, onMarkAsRead }) => {
  const getIcon = (iconType: string, type: string) => {
    console.log(type);
    
    const iconStyle = { fontSize: '20px' };
    
    switch (iconType) {
      case 'check-circle':
        return <CheckCircleOutlined style={{ ...iconStyle, color: '#52c41a' }} />;
      case 'warning':
        return <WarningOutlined style={{ ...iconStyle, color: '#faad14' }} />;
      case 'info-circle':
        return <InfoCircleOutlined style={{ ...iconStyle, color: '#1890ff' }} />;
      default:
        return <InfoCircleOutlined style={{ ...iconStyle, color: '#1890ff' }} />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'success':
        return '#f6ffed';
      case 'warning':
        return '#fffbe6';
      case 'info':
        return '#f0f9ff';
      default:
        return '#f9f9f9';
    }
  };

  const getBorderColor = (type: string) => {
    switch (type) {
      case 'success':
        return '#b7eb8f';
      case 'warning':
        return '#ffe58f';
      case 'info':
        return '#87d1ff';
      default:
        return '#d9d9d9';
    }
  };

  return (
    <List.Item
      style={{
        backgroundColor: notification.isRead ? '#ffffff' : getTypeColor(notification.type),
        border: `1px solid ${getBorderColor(notification.type)}`,
        borderRadius: '8px',
        marginBottom: '12px',
        padding: '16px',
        transition: 'all 0.3s ease',
        cursor: 'pointer',
        boxShadow: notification.isRead ? 'none' : '0 2px 8px rgba(0, 0, 0, 0.1)'
      }}
      onClick={() => !notification.isRead && onMarkAsRead(notification.id)}
    >
      <List.Item.Meta
        avatar={
          <Avatar 
            icon={getIcon(notification.icon, notification.type)}
            style={{ 
              backgroundColor: 'transparent',
              border: 'none'
            }}
            size="large"
          />
        }
        title={
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <Text 
              strong={!notification.isRead}
              style={{ 
                fontSize: '16px',
                fontWeight: notification.isRead ? 'normal' : '600',
                color: notification.isRead ? '#595959' : '#262626',
                lineHeight: '1.4'
              }}
            >
              {notification.title}
            </Text>
            {!notification.isRead && (
              <Button
                type="link"
                size="small"
                icon={<EyeOutlined />}
                style={{ 
                  fontSize: '12px',
                  padding: '2px 8px',
                  height: 'auto',
                  color: '#1890ff'
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  onMarkAsRead(notification.id);
                }}
              >
                Đánh dấu đã đọc
              </Button>
            )}
          </div>
        }
        description={
          <div style={{ marginTop: '8px' }}>
            <Text 
              style={{ 
                fontSize: '14px',
                color: notification.isRead ? '#8c8c8c' : '#595959',
                lineHeight: '1.5',
                display: 'block',
                marginBottom: '8px'
              }}
            >
              {notification.message}
            </Text>
            <Space align="center" style={{ marginTop: '8px' }}>
              <Text 
                type="secondary" 
                style={{ 
                  fontSize: '12px',
                  fontStyle: 'italic'
                }}
              >
                {notification.time}
              </Text>
              {!notification.isRead && (
                <div
                  style={{
                    width: '8px',
                    height: '8px',
                    backgroundColor: '#1890ff',
                    borderRadius: '50%',
                    marginLeft: '8px'
                  }}
                />
              )}
            </Space>
          </div>
        }
      />
    </List.Item>
  );
};

export default NotificationCard;