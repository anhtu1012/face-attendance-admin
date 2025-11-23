"use client";
import { useAntdMessage } from "@/hooks/AntdMessageProvider";
import JobServices from "@/services/tac-vu-nhan-su/tuyen-dung/job/job.service";
import { Avatar, Button, Input, List, Modal, Tag } from "antd";
import React, { useEffect, useState } from "react";
import { FaCheck, FaSearch, FaShareAlt, FaUser } from "react-icons/fa";
import { MdEmail, MdPhone } from "react-icons/md";
import "./JobShareModal.scss";
import { HRUser } from "@/dtos/tac-vu-nhan-su/tuyen-dung/job/job-share.dto";
import { useSelector } from "react-redux";
import { selectAuthLogin } from "@/lib/store/slices/loginSlice";

interface JobShareModalProps {
  open: boolean;
  onClose: () => void;
  jobCode: string;
  jobId: string;
  jobTitle: string;
  onShareSuccess?: () => void;
}

const JobShareModal: React.FC<JobShareModalProps> = ({
  open,
  onClose,
  jobCode,
  jobId,
  jobTitle,
  onShareSuccess,
}) => {
  const [searchText, setSearchText] = useState("");
  const [selectedUser, setSelectedUser] = useState<HRUser | null>(null);

  const [loading, setLoading] = useState(false);
  const messageApi = useAntdMessage();
  const { userProfile } = useSelector(selectAuthLogin);
  // Mock data - Replace with API calls
  const [hrUsers, setHrUsers] = useState<HRUser[]>([]);

  const fetchData = async () => {
    try {
      const resHr = await JobServices.getHRUsers();
      setHrUsers(resHr.data);
    } catch {
      messageApi.error("Lấy danh sách HR thất bại");
    }
  };
  useEffect(() => {
    if (open) {
      fetchData();
    }
  }, [open]);

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
      const payload = {
        jobId,
        hrId: String(userProfile?.id) || "",
        assignedHrId: selectedUser.id,
      };
      await JobServices.shareJob(payload);

      // Mock success
      setTimeout(() => {
        setLoading(false);
        onShareSuccess?.();
        onClose();
        // Reset form
        setSelectedUser(null);
        setSearchText("");
      }, 1000);
    } catch (error) {
      console.error("Error sharing job:", error);
      setLoading(false);
    }
  };

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
      <div className="share-tab-content">
        <div className="job-info-card">
          <div className="job-info-header">
            <h4>Công việc cần chia sẻ</h4>
            <Tag color="blue">{jobCode}</Tag>
          </div>
          <p
            style={{
              fontSize: "16px",
              color: "rgb(255 168 46);",
              fontWeight: "bold",
            }}
          >
            {jobTitle}
          </p>
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
    </Modal>
  );
};

export default JobShareModal;
