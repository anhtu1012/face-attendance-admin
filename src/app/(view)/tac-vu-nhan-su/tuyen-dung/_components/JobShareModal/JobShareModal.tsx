"use client";
import {
  Avatar,
  Badge,
  Button,
  Input,
  List,
  Modal,
  Tabs,
  Tag,
  Tooltip,
} from "antd";
import React, { useState } from "react";
import {
  FaCheck,
  FaClock,
  FaSearch,
  FaShareAlt,
  FaTimes,
  FaUser,
} from "react-icons/fa";
import { MdEmail, MdPhone } from "react-icons/md";
import "./JobShareModal.scss";

interface HRUser {
  id: string;
  fullName: string;
  email: string;
  phone?: string;
  avatar?: string;
  department?: string;
  status: "active" | "inactive";
}

interface ShareRequest {
  id: string;
  jobCode: string;
  jobTitle: string;
  fromUser: {
    fullName: string;
    email: string;
    avatar?: string;
  };
  toUser: {
    fullName: string;
    email: string;
    avatar?: string;
  };
  status: "pending" | "accepted" | "rejected";
  createdAt: string;
  message?: string;
}

interface JobShareModalProps {
  open: boolean;
  onClose: () => void;
  jobCode: string;
  jobTitle: string;
  onShareSuccess?: () => void;
}

const JobShareModal: React.FC<JobShareModalProps> = ({
  open,
  onClose,
  jobCode,
  jobTitle,
  onShareSuccess,
}) => {
  const [activeTab, setActiveTab] = useState("1");
  const [searchText, setSearchText] = useState("");
  const [selectedUser, setSelectedUser] = useState<HRUser | null>(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  // Mock data - Replace with API calls
  const [hrUsers] = useState<HRUser[]>([
    {
      id: "1",
      fullName: "Nguyễn Văn A",
      email: "nguyenvana@company.com",
      phone: "0901234567",
      department: "Nhân sự",
      status: "active",
    },
    {
      id: "2",
      fullName: "Trần Thị B",
      email: "tranthib@company.com",
      phone: "0902345678",
      department: "Nhân sự",
      status: "active",
    },
    {
      id: "3",
      fullName: "Lê Văn C",
      email: "levanc@company.com",
      phone: "0903456789",
      department: "Tuyển dụng",
      status: "active",
    },
  ]);

  const [shareRequests, setShareRequests] = useState<ShareRequest[]>([
    {
      id: "1",
      jobCode: "JOB001",
      jobTitle: "Senior Frontend Developer",
      fromUser: {
        fullName: "Admin User",
        email: "admin@company.com",
      },
      toUser: {
        fullName: "Nguyễn Văn A",
        email: "nguyenvana@company.com",
      },
      status: "pending",
      createdAt: "2024-01-15T10:30:00",
      message: "Nhờ bạn hỗ trợ quản lý công việc này",
    },
  ]);

  const filteredUsers = hrUsers.filter(
    (user) =>
      user.fullName.toLowerCase().includes(searchText.toLowerCase()) ||
      user.email.toLowerCase().includes(searchText.toLowerCase())
  );

  const handleSelectUser = (user: HRUser) => {
    setSelectedUser(user);
  };

  const handleShareJob = async () => {
    if (!selectedUser) return;

    setLoading(true);
    try {
      // TODO: Call API to create share request
      console.log("Sharing job:", {
        jobCode,
        toUserId: selectedUser.id,
        message,
      });

      // Mock success
      setTimeout(() => {
        setLoading(false);
        onShareSuccess?.();
        onClose();
        // Reset form
        setSelectedUser(null);
        setMessage("");
        setSearchText("");
      }, 1000);
    } catch (error) {
      console.error("Error sharing job:", error);
      setLoading(false);
    }
  };

  const handleCancelRequest = async (requestId: string) => {
    // TODO: Call API to cancel share request
    console.log("Cancelling request:", requestId);
    setShareRequests((prev) => prev.filter((req) => req.id !== requestId));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "orange";
      case "accepted":
        return "green";
      case "rejected":
        return "red";
      default:
        return "default";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "pending":
        return "Chờ xác nhận";
      case "accepted":
        return "Đã chấp nhận";
      case "rejected":
        return "Đã từ chối";
      default:
        return status;
    }
  };

  const tabItems = [
    {
      key: "1",
      label: (
        <span>
          <FaShareAlt /> Chia sẻ công việc
        </span>
      ),
      children: (
        <div className="share-tab-content">
          <div className="job-info-card">
            <div className="job-info-header">
              <h4>Công việc cần chia sẻ</h4>
              <Tag color="blue">{jobCode}</Tag>
            </div>
            <p className="job-title">{jobTitle}</p>
          </div>

          <div className="search-section">
            <Input
              placeholder="Tìm kiếm HR theo tên hoặc email..."
              prefix={<FaSearch />}
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              size="large"
              allowClear
            />
          </div>

          <div className="users-list-section">
            <h4>Chọn HR để chia sẻ</h4>
            <List
              className="hr-users-list"
              dataSource={filteredUsers}
              renderItem={(user) => (
                <List.Item
                  className={`user-item ${
                    selectedUser?.id === user.id ? "selected" : ""
                  }`}
                  onClick={() => handleSelectUser(user)}
                >
                  <div className="user-item-content">
                    <Avatar
                      size={48}
                      icon={<FaUser />}
                      src={user.avatar}
                      className="user-avatar"
                    />
                    <div className="user-info">
                      <div className="user-name">
                        <span>{user.fullName}</span>
                        {selectedUser?.id === user.id && (
                          <FaCheck className="check-icon" />
                        )}
                      </div>
                      <div className="user-details">
                        <span className="user-email">
                          <MdEmail /> {user.email}
                        </span>
                        {user.phone && (
                          <span className="user-phone">
                            <MdPhone /> {user.phone}
                          </span>
                        )}
                      </div>
                      {user.department && (
                        <Tag color="blue" className="department-tag">
                          {user.department}
                        </Tag>
                      )}
                    </div>
                  </div>
                </List.Item>
              )}
              locale={{ emptyText: "Không tìm thấy HR nào" }}
            />
          </div>

          {selectedUser && (
            <div className="message-section">
              <h4>Lời nhắn (không bắt buộc)</h4>
              <Input.TextArea
                placeholder="Nhập lời nhắn gửi đến HR..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={3}
                maxLength={500}
                showCount
              />
            </div>
          )}

          <div className="share-actions">
            <Button size="large" onClick={onClose}>
              Hủy
            </Button>
            <Button
              type="primary"
              size="large"
              icon={<FaShareAlt />}
              onClick={handleShareJob}
              loading={loading}
              disabled={!selectedUser}
            >
              Chia sẻ công việc
            </Button>
          </div>
        </div>
      ),
    },
    {
      key: "2",
      label: (
        <span>
          <FaClock /> Yêu cầu đang chờ{" "}
          <Badge
            count={shareRequests.filter((r) => r.status === "pending").length}
            showZero
          />
        </span>
      ),
      children: (
        <div className="requests-tab-content">
          <div className="requests-header">
            <h4>Danh sách yêu cầu chia sẻ</h4>
            <Tag color="orange">
              {shareRequests.filter((r) => r.status === "pending").length} đang
              chờ
            </Tag>
          </div>

          <List
            className="share-requests-list"
            dataSource={shareRequests}
            renderItem={(request) => (
              <List.Item className="request-item">
                <div className="request-card">
                  <div className="request-header">
                    <div className="request-title">
                      <h4>{request.jobTitle}</h4>
                      <Tag color="blue">{request.jobCode}</Tag>
                      <Badge
                        color={getStatusColor(request.status)}
                        text={getStatusText(request.status)}
                      />
                    </div>
                    {request.status === "pending" && (
                      <Tooltip title="Hủy yêu cầu">
                        <Button
                          type="text"
                          danger
                          icon={<FaTimes />}
                          onClick={() => handleCancelRequest(request.id)}
                        />
                      </Tooltip>
                    )}
                  </div>

                  <div className="request-users">
                    <div className="user-info-item">
                      <span className="label">Từ:</span>
                      <div className="user-detail">
                        <Avatar
                          size={32}
                          icon={<FaUser />}
                          src={request.fromUser.avatar}
                        />
                        <div>
                          <div className="user-name">
                            {request.fromUser.fullName}
                          </div>
                          <div className="user-email">
                            {request.fromUser.email}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="arrow">→</div>

                    <div className="user-info-item">
                      <span className="label">Đến:</span>
                      <div className="user-detail">
                        <Avatar
                          size={32}
                          icon={<FaUser />}
                          src={request.toUser.avatar}
                        />
                        <div>
                          <div className="user-name">
                            {request.toUser.fullName}
                          </div>
                          <div className="user-email">
                            {request.toUser.email}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {request.message && (
                    <div className="request-message">
                      <strong>Lời nhắn:</strong> {request.message}
                    </div>
                  )}

                  <div className="request-footer">
                    <span className="request-date">
                      <FaClock />{" "}
                      {new Date(request.createdAt).toLocaleString("vi-VN")}
                    </span>
                  </div>
                </div>
              </List.Item>
            )}
            locale={{ emptyText: "Không có yêu cầu chia sẻ nào" }}
          />
        </div>
      ),
    },
  ];

  return (
    <Modal
      open={open}
      onCancel={onClose}
      footer={null}
      width={800}
      className="job-share-modal"
      title={
        <div className="modal-title">
          <FaShareAlt />
          <span>Chia sẻ quản lý công việc</span>
        </div>
      }
    >
      <Tabs
        activeKey={activeTab}
        onChange={setActiveTab}
        items={tabItems}
        className="share-tabs"
      />
    </Modal>
  );
};

export default JobShareModal;
