"use client";
import { useAntdMessage } from "@/hooks/AntdMessageProvider";
// import JobServices from "@/services/tac-vu-nhan-su/tuyen-dung/job/job.service";
import { JobShareRequest } from "@/dtos/tac-vu-nhan-su/tuyen-dung/job/job-share.dto";
import { selectAuthLogin } from "@/lib/store/slices/loginSlice";
import QuanLyDonTuServices from "@/services/tac-vu-nhan-su/quan-ly-don-tu/quan-ly-don-tu.service";
import JobServices from "@/services/tac-vu-nhan-su/tuyen-dung/job/job.service";
import { getDowFromDate } from "@/utils/client/getDowFromDate";
import {
  Avatar,
  Badge,
  Button,
  Empty,
  List,
  Modal,
  Spin,
  Tabs,
  Tag,
  Tooltip,
} from "antd";
import React, { useEffect, useState } from "react";
import { FaCheck, FaClock, FaTimes, FaUser, FaUserCheck } from "react-icons/fa";
import { useSelector } from "react-redux";
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
  const [activeTab, setActiveTab] = useState("PENDING");
  const [shareRequests, setShareRequests] = useState<JobShareRequest[]>([]);
  const [shareMyRequests, setShareMyRequests] = useState<JobShareRequest[]>([]);
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const messageApi = useAntdMessage();
  const { userProfile } = useSelector(selectAuthLogin);

  const fetchShareRequests = async () => {
    setLoading(true);
    try {
      const response = await JobServices.getShareRequests(
        null,
        String(userProfile.id)
      );
      const responseMyReq = await JobServices.getShareRequests(
        String(userProfile.id)
      );
      setShareMyRequests(responseMyReq.data);
      setShareRequests(response.data);
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

  const handleRequest = async (
    request: JobShareRequest,
    status: "ACCEPTED" | "REJECTED" | "INACTIVE"
  ) => {
    setActionLoading(request.id);
    try {
      const dow = getDowFromDate(request.createdAt || undefined);
      const res = await QuanLyDonTuServices.approveQuanLyDonTu(request.id, {
        status,
        response: status === "ACCEPTED" ? "Đồng ý" : "Từ chối",
        dow,
      });
      messageApi.success(
        status === "ACCEPTED"
          ? "Đã chấp nhận yêu cầu chia sẻ!"
          : " Đã từ chối yêu cầu chia sẻ!"
      );
      setShareRequests((prev) =>
        prev.map((req) =>
          req.id === request.id
            ? {
                ...req,
                status: res.status,
                response: res.response,
              }
            : req
        )
      );
      setActionLoading(null);
      onRequestUpdate?.();
    } catch (error) {
      console.error("Error accepting request:", error);
      messageApi.error("Không thể chấp nhận yêu cầu!");
      setActionLoading(null);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "PENDING":
        return "orange";
      case "ACCEPTED":
        return "green";
      case "REJECTED":
        return "red";
      default:
        return "default";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "PENDING":
        return "Chờ xác nhận";
      case "ACCEPTED":
        return "Đã chấp nhận";
      case "REJECTED":
        return "Đã từ chối";
      default:
        return status;
    }
  };

  const filterRequestsByStatus = (status: string) => {
    return shareRequests.filter((req) => req.status === status);
  };

  const renderRequestCard = (
    request: JobShareRequest,
    myRequests?: boolean
  ) => (
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
          {request.status === "PENDING" && !myRequests && (
            <div className="request-actions">
              <Tooltip title="Chấp nhận">
                <Button
                  type="primary"
                  shape="circle"
                  icon={<FaCheck />}
                  onClick={() => handleRequest(request, "ACCEPTED")}
                  loading={actionLoading === request.id}
                  className="accept-btn"
                />
              </Tooltip>
              <Tooltip title="Từ chối">
                <Button
                  danger
                  shape="circle"
                  icon={<FaTimes />}
                  onClick={() => handleRequest(request, "REJECTED")}
                  loading={actionLoading === request.id}
                  className="reject-btn"
                />
              </Tooltip>
            </div>
          )}
          {request.status === "PENDING" && (
            <Tooltip title="Hủy yêu cầu">
              <Button
                type="text"
                danger
                icon={<FaTimes />}
                onClick={() => handleRequest(request, "INACTIVE")}
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

        {/* {request.message && (
          <div className="request-message">
            <strong>Lời nhắn:</strong> {request.message}
          </div>
        )} */}

        <div className="request-footer">
          <span className="request-date">
            <FaClock /> {new Date(request.createdAt).toLocaleString("vi-VN")}
          </span>
        </div>
      </div>
    </List.Item>
  );

  const pendingRequests = filterRequestsByStatus("PENDING");
  const ACCEPTEDRequests = filterRequestsByStatus("ACCEPTED");
  const rejectedRequests = filterRequestsByStatus("REJECTED");

  const tabItems = [
    {
      key: "PENDING",
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
              renderItem={(item) => renderRequestCard(item)}
            />
          )}
        </div>
      ),
    },
    {
      key: "ACCEPTED",
      label: (
        <span>
          <FaCheck /> Đã chấp nhận{" "}
          <Badge count={ACCEPTEDRequests.length} showZero color="green" />
        </span>
      ),
      children: (
        <div className="requests-list-container">
          {loading ? (
            <div className="loading-container">
              <Spin size="large" />
            </div>
          ) : ACCEPTEDRequests.length === 0 ? (
            <Empty description="Không có yêu cầu đã chấp nhận" />
          ) : (
            <List
              className="share-requests-list"
              dataSource={ACCEPTEDRequests}
              renderItem={(item) => renderRequestCard(item)}
            />
          )}
        </div>
      ),
    },
    {
      key: "REJECTED",
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
              renderItem={(item) => renderRequestCard(item)}
            />
          )}
        </div>
      ),
    },
    {
      key: "MY_REQUESTS",
      label: (
        <span>
          <FaClock /> Đơn của tôi
          <Badge count={shareMyRequests.length} showZero />
        </span>
      ),
      children: (
        <div className="requests-list-container">
          {loading ? (
            <div className="loading-container">
              <Spin size="large" />
            </div>
          ) : shareMyRequests.length === 0 ? (
            <Empty description="Không có yêu cầu chờ duyệt" />
          ) : (
            <List
              className="share-requests-list"
              dataSource={shareMyRequests}
              renderItem={(item) => renderRequestCard(item, true)}
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
