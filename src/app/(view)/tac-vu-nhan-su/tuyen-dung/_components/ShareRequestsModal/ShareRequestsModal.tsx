"use client";
import { useAntdMessage } from "@/hooks/AntdMessageProvider";
// import JobServices from "@/services/tac-vu-nhan-su/tuyen-dung/job/job.service";
import { Avatar, Badge, Button, Empty, List, Modal, Spin, Tabs, Tag, Tooltip } from "antd";
import React, { useEffect, useState } from "react";
import {
  FaCheck,
  FaClock,
  FaTimes,
  FaUser,
  FaUserCheck,
} from "react-icons/fa";
import { JobShareRequest } from "@/dtos/tac-vu-nhan-su/tuyen-dung/job/job-share.dto";
import "./ShareRequestsModal.scss";

interface ShareRequestsModalProps {
  open: boolean;
  onClose: () => void;
  onRequestUpdate?: () => void;
}

const ShareRequestsModal: React.FC<ShareRequestsModalProps> = ({
  open,
  onClose,
  onRequestUpdate,
}) => {
  const [activeTab, setActiveTab] = useState("pending");
  const [shareRequests, setShareRequests] = useState<JobShareRequest[]>([
    // Fake data for testing
    {
      id: "1",
      jobCode: "JOB001",
      jobTitle: "Senior Frontend Developer (React/Next.js)",
      fromUser: {
        id: "user1",
        fullName: "Nguyễn Văn Minh",
        email: "minh.nguyen@company.com",
        avatar: "",
      },
      toUser: {
        id: "user2",
        fullName: "Trần Thị Hương",
        email: "huong.tran@company.com",
        avatar: "",
      },
      status: "pending",
      createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
      message: "Nhờ bạn hỗ trợ quản lý công việc tuyển dụng vị trí này. Cần người có kinh nghiệm về React.",
    },
    {
      id: "2",
      jobCode: "JOB002",
      jobTitle: "Backend Developer (Node.js, NestJS)",
      fromUser: {
        id: "user1",
        fullName: "Nguyễn Văn Minh",
        email: "minh.nguyen@company.com",
        avatar: "",
      },
      toUser: {
        id: "user3",
        fullName: "Lê Hoàng Nam",
        email: "nam.le@company.com",
        avatar: "",
      },
      status: "pending",
      createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(), // 5 hours ago
      message: "Bạn có kinh nghiệm về backend, nhờ bạn phụ trách vị trí này nhé!",
    },
    {
      id: "3",
      jobCode: "JOB003",
      jobTitle: "UI/UX Designer",
      fromUser: {
        id: "user4",
        fullName: "Phạm Thu Thảo",
        email: "thao.pham@company.com",
        avatar: "",
      },
      toUser: {
        id: "user2",
        fullName: "Trần Thị Hương",
        email: "huong.tran@company.com",
        avatar: "",
      },
      status: "pending",
      createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
      message: "",
    },
    {
      id: "4",
      jobCode: "JOB004",
      jobTitle: "Full Stack Developer (MERN Stack)",
      fromUser: {
        id: "user1",
        fullName: "Nguyễn Văn Minh",
        email: "minh.nguyen@company.com",
        avatar: "",
      },
      toUser: {
        id: "user5",
        fullName: "Võ Minh Tuấn",
        email: "tuan.vo@company.com",
        avatar: "",
      },
      status: "accepted",
      createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
      message: "Vị trí này phù hợp với chuyên môn của bạn, nhờ bạn đảm nhận nhé!",
    },
    {
      id: "5",
      jobCode: "JOB005",
      jobTitle: "DevOps Engineer",
      fromUser: {
        id: "user4",
        fullName: "Phạm Thu Thảo",
        email: "thao.pham@company.com",
        avatar: "",
      },
      toUser: {
        id: "user3",
        fullName: "Lê Hoàng Nam",
        email: "nam.le@company.com",
        avatar: "",
      },
      status: "accepted",
      createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days ago
      message: "Cảm ơn bạn đã nhận quản lý công việc này!",
    },
    {
      id: "6",
      jobCode: "JOB006",
      jobTitle: "Mobile Developer (Flutter)",
      fromUser: {
        id: "user1",
        fullName: "Nguyễn Văn Minh",
        email: "minh.nguyen@company.com",
        avatar: "",
      },
      toUser: {
        id: "user2",
        fullName: "Trần Thị Hương",
        email: "huong.tran@company.com",
        avatar: "",
      },
      status: "rejected",
      createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days ago
      message: "Nhờ bạn hỗ trợ tuyển dụng vị trí mobile developer.",
    },
    {
      id: "7",
      jobCode: "JOB007",
      jobTitle: "Data Analyst",
      fromUser: {
        id: "user4",
        fullName: "Phạm Thu Thảo",
        email: "thao.pham@company.com",
        avatar: "",
      },
      toUser: {
        id: "user5",
        fullName: "Võ Minh Tuấn",
        email: "tuan.vo@company.com",
        avatar: "",
      },
      status: "rejected",
      createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days ago
      message: "Vị trí này cần người có kinh nghiệm phân tích dữ liệu.",
    },
  ]);
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const messageApi = useAntdMessage();

  const fetchShareRequests = async () => {
    setLoading(true);
    try {
      // Uncomment when API is ready
      // const response = await JobServices.getShareRequests();
      // setShareRequests(response);
      
      // Simulate API call delay
      setTimeout(() => {
        setLoading(false);
      }, 500);
    } catch (error) {
      console.error("Error fetching share requests:", error);
      messageApi.error("Không thể tải danh sách yêu cầu!");
      setLoading(false);
    }
  };

  useEffect(() => {
    if (open) {
      fetchShareRequests();
    }
  }, [open]);

  const handleAcceptRequest = async (requestId: string) => {
    setActionLoading(requestId);
    try {
      // Uncomment when API is ready
      // await JobServices.acceptShareRequest({ requestId });
      
      // Simulate API call
      setTimeout(() => {
        setShareRequests((prev) =>
          prev.map((req) =>
            req.id === requestId ? { ...req, status: "accepted" as const } : req
          )
        );
        messageApi.success("Đã chấp nhận yêu cầu chia sẻ!");
        setActionLoading(null);
        onRequestUpdate?.();
      }, 500);
    } catch (error) {
      console.error("Error accepting request:", error);
      messageApi.error("Không thể chấp nhận yêu cầu!");
      setActionLoading(null);
    }
  };

  const handleRejectRequest = async (requestId: string) => {
    setActionLoading(requestId);
    try {
      // Uncomment when API is ready
      // await JobServices.rejectShareRequest({ requestId });
      
      // Simulate API call
      setTimeout(() => {
        setShareRequests((prev) =>
          prev.map((req) =>
            req.id === requestId ? { ...req, status: "rejected" as const } : req
          )
        );
        messageApi.success("Đã từ chối yêu cầu chia sẻ!");
        setActionLoading(null);
        onRequestUpdate?.();
      }, 500);
    } catch (error) {
      console.error("Error rejecting request:", error);
      messageApi.error("Không thể từ chối yêu cầu!");
      setActionLoading(null);
    }
  };

  const handleCancelRequest = async (requestId: string) => {
    setActionLoading(requestId);
    try {
      // Uncomment when API is ready
      // await JobServices.cancelShareRequest(requestId);
      
      // Simulate API call
      setTimeout(() => {
        setShareRequests((prev) => prev.filter((req) => req.id !== requestId));
        messageApi.success("Đã hủy yêu cầu!");
        setActionLoading(null);
        onRequestUpdate?.();
      }, 500);
    } catch (error) {
      console.error("Error cancelling request:", error);
      messageApi.error("Không thể hủy yêu cầu!");
      setActionLoading(null);
    }
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

  const filterRequestsByStatus = (status: string) => {
    return shareRequests.filter((req) => req.status === status);
  };

  const renderRequestCard = (request: JobShareRequest) => (
    <List.Item className="request-item" key={request.id}>
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
            <div className="request-actions">
              <Tooltip title="Chấp nhận">
                <Button
                  type="primary"
                  shape="circle"
                  icon={<FaCheck />}
                  onClick={() => handleAcceptRequest(request.id)}
                  loading={actionLoading === request.id}
                  className="accept-btn"
                />
              </Tooltip>
              <Tooltip title="Từ chối">
                <Button
                  danger
                  shape="circle"
                  icon={<FaTimes />}
                  onClick={() => handleRejectRequest(request.id)}
                  loading={actionLoading === request.id}
                  className="reject-btn"
                />
              </Tooltip>
            </div>
          )}
          {request.status === "pending" && (
            <Tooltip title="Hủy yêu cầu">
              <Button
                type="text"
                danger
                icon={<FaTimes />}
                onClick={() => handleCancelRequest(request.id)}
                loading={actionLoading === request.id}
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
                <div className="user-name">{request.fromUser.fullName}</div>
                <div className="user-email">{request.fromUser.email}</div>
              </div>
            </div>
          </div>

          <div className="arrow">→</div>

          <div className="user-info-item">
            <span className="label">Đến:</span>
            <div className="user-detail">
              <Avatar size={32} icon={<FaUser />} src={request.toUser.avatar} />
              <div>
                <div className="user-name">{request.toUser.fullName}</div>
                <div className="user-email">{request.toUser.email}</div>
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
            <FaClock /> {new Date(request.createdAt).toLocaleString("vi-VN")}
          </span>
        </div>
      </div>
    </List.Item>
  );

  const pendingRequests = filterRequestsByStatus("pending");
  const acceptedRequests = filterRequestsByStatus("accepted");
  const rejectedRequests = filterRequestsByStatus("rejected");

  const tabItems = [
    {
      key: "pending",
      label: (
        <span>
          <FaClock /> Chờ duyệt{" "}
          <Badge count={pendingRequests.length} showZero />
        </span>
      ),
      children: (
        <div className="requests-list-container">
          {loading ? (
            <div className="loading-container">
              <Spin size="large" />
            </div>
          ) : pendingRequests.length === 0 ? (
            <Empty description="Không có yêu cầu chờ duyệt" />
          ) : (
            <List
              className="share-requests-list"
              dataSource={pendingRequests}
              renderItem={renderRequestCard}
            />
          )}
        </div>
      ),
    },
    {
      key: "accepted",
      label: (
        <span>
          <FaCheck /> Đã chấp nhận{" "}
          <Badge count={acceptedRequests.length} showZero color="green" />
        </span>
      ),
      children: (
        <div className="requests-list-container">
          {loading ? (
            <div className="loading-container">
              <Spin size="large" />
            </div>
          ) : acceptedRequests.length === 0 ? (
            <Empty description="Không có yêu cầu đã chấp nhận" />
          ) : (
            <List
              className="share-requests-list"
              dataSource={acceptedRequests}
              renderItem={renderRequestCard}
            />
          )}
        </div>
      ),
    },
    {
      key: "rejected",
      label: (
        <span>
          <FaTimes /> Đã từ chối{" "}
          <Badge count={rejectedRequests.length} showZero color="red" />
        </span>
      ),
      children: (
        <div className="requests-list-container">
          {loading ? (
            <div className="loading-container">
              <Spin size="large" />
            </div>
          ) : rejectedRequests.length === 0 ? (
            <Empty description="Không có yêu cầu đã từ chối" />
          ) : (
            <List
              className="share-requests-list"
              dataSource={rejectedRequests}
              renderItem={renderRequestCard}
            />
          )}
        </div>
      ),
    },
  ];

  return (
    <Modal
      open={open}
      onCancel={onClose}
      footer={null}
      width={900}
      className="share-requests-modal"
      title={
        <div className="modal-title">
          <FaUserCheck />
          <span>Quản lý yêu cầu chia sẻ công việc</span>
        </div>
      }
    >
      <Tabs
        activeKey={activeTab}
        onChange={setActiveTab}
        items={tabItems}
        className="requests-tabs"
      />
    </Modal>
  );
};

export default ShareRequestsModal;
