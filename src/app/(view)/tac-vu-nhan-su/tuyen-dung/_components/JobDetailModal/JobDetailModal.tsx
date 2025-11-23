"use client";
import { JobDetail } from "@/dtos/tac-vu-nhan-su/tuyen-dung/job/job-detail.dto";
import { useAntdMessage } from "@/hooks/AntdMessageProvider";
import JobServices from "@/services/tac-vu-nhan-su/tuyen-dung/job/job.service";
import { Badge, Button, Modal, Progress, Spin, Tabs } from "antd";
import axios from "axios";
import dayjs from "dayjs";
import React, { useEffect, useState } from "react";
import {
  FaBriefcase,
  FaBuilding,
  FaClock,
  FaCopy,
  FaEdit,
  FaEye,
  FaGraduationCap,
  FaLink,
  FaMapMarkerAlt,
  FaMoneyBillWave,
  FaShareAlt,
  FaStar,
  FaUsers,
} from "react-icons/fa";
import { MdAutoDelete, MdEmail, MdPhone } from "react-icons/md";
import { getStatusColor, getStatusText } from "../../_utils/status";
import JobShareModal from "../JobShareModal/JobShareModal";
import "./JobDetailModal.scss";

interface JobDetailModalProps {
  open: boolean;
  onClose: () => void;
  jobCode: string;
}

const JobDetailModal: React.FC<JobDetailModalProps> = ({
  open,
  onClose,
  jobCode,
}) => {
  const [jobDetails, setJobDetails] = useState<JobDetail>();
  const [viewsLoading, setViewsLoading] = useState(false);
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const messageApi = useAntdMessage();
  const companyInfo = {
    companyName: "FaceAI Technology Solutions",
    workingHours: "8:00 - 17:30 (T2-T6)",
  };
  const fetchJobDetails = async (jobCode: string) => {
    try {
      const res = await JobServices.getDetailJob(jobCode);
      // Set job details early so the modal can render while we fetch views
      setJobDetails(res);

      // Use axios to fetch views count from internal API and show a spinner while loading
      let views: number | null = null;
      setViewsLoading(true);
      try {
        const resp = await axios.get(
          `/api/views?jobCode=${encodeURIComponent(jobCode)}`
        );
        views = resp.data.views;
      } catch (err) {
        console.warn("Error fetching views from /api/views:", err);
      } finally {
        setViewsLoading(false);
      }

      // tỷ lệ ứng tuyển = applicants / views
      const applicationRate =
        res.statistics && res.statistics.applicants && views
          ? (Number(res.statistics.applicants) / Number(views)) * 100
          : 0;
      console.log("Tỷ lệ ứng tuyển:", applicationRate);

      // Update jobDetails with views and applicationRate once available
      setJobDetails((prev) =>
        prev
          ? {
              ...prev,
              statistics: {
                ...prev.statistics,
                views: Number(views ?? 0),
                applicationRate,
              },
            }
          : prev
      );
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    if (jobCode) {
      fetchJobDetails(jobCode);
    }
  }, [jobCode]);
  if (!jobDetails) return null;

  const handleApply = () => {
    // Create job application link
    const applicationLink = `${window.location.origin}/apply/${jobDetails?.jobCode}`;

    // Open in new tab
    window.open(applicationLink, "_blank");
  };

  const handleCopyApplicationLink = async () => {
    const applicationLink = `${window.location.origin}/apply/${jobDetails.jobCode}`;

    try {
      await navigator.clipboard.writeText(applicationLink);
      messageApi.success("Đã sao chép link ứng tuyển!");
    } catch (error) {
      console.error("Error copying link:", error);
      messageApi.error("Không thể sao chép link!");
    }
  };

  const handleDeleteJob = async () => {
    try {
      await JobServices.deleteJob(String(jobDetails.id));
    } catch (error) {
      console.log(error);
      messageApi.error("Xóa công việc thất bại!");
    }
  };

  const handleShareJob = () => {
    setShareModalOpen(true);
  };

  const tabItems = [
    {
      key: "1",
      label: "Mô tả công việc",
      children: (
        <div className="job-content-section">
          <div className="content-block">
            <h4>
              <FaBriefcase /> Trách nhiệm công việc
            </h4>
            <div
              className="content"
              dangerouslySetInnerHTML={{
                __html: jobDetails.jobResponsibility ?? "",
              }}
            />
          </div>

          <div className="content-block">
            <h4>
              <FaGraduationCap /> Yêu cầu ứng viên
            </h4>
            <div
              className="content"
              dangerouslySetInnerHTML={{ __html: jobDetails.jobOverview ?? "" }}
            />
          </div>

          <div className="content-block">
            <h4>
              <FaStar /> Quyền lợi
            </h4>
            <div
              className="content"
              dangerouslySetInnerHTML={{ __html: jobDetails.jobBenefit ?? "" }}
            />
          </div>
        </div>
      ),
    },
    {
      key: "2",
      label: "Thông tin tuyển dụng",
      children: (
        <div className="recruitment-info">
          <div className="info-grid">
            {/* <div className="info-item">
              <span className="info-label">Hình thức làm việc:</span>
              <span className="info-value">Toàn thời gian</span>
            </div> */}
            <div className="info-item">
              <span className="info-label">Thời gian làm việc:</span>
              <span className="info-value">{companyInfo.workingHours}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Thời gian thử việc:</span>
              <span className="info-value">{jobDetails.trialPeriod}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Hạn nộp hồ sơ:</span>
              <span className="info-value highlight">
                {dayjs(jobDetails.expirationDate).format("DD/MM/YYYY")}
              </span>
            </div>
          </div>

          <div className="skills-section">
            <h4>Kỹ năng yêu cầu</h4>
            <div className="skills-tags">
              {jobDetails.requireSkill.map((skill, index) => (
                <Badge
                  key={index}
                  color="blue"
                  text={skill}
                  className="skill-tag"
                />
              ))}
            </div>
          </div>

          <div className="recruiter-info">
            <h4>Thông tin người tuyển dụng</h4>
            <div className="recruiter-card">
              <div className="recruiter-avatar">
                <FaUsers />
              </div>
              <div className="recruiter-details">
                <h5>{jobDetails.recruiter.email}</h5>
                <p>{jobDetails.recruiter.fullName}</p>
                <div className="contact-info">
                  <div className="contact-item">
                    <MdEmail />
                    <span>{jobDetails.recruiter.email}</span>
                  </div>
                  <div className="contact-item">
                    <MdPhone />
                    <span>{jobDetails.recruiter.phone}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ),
    },
    {
      key: "3",
      label: "Thống kê",
      children: (
        <div className="statistics-section">
          <div className="stats-grid">
            <div className="stat-item">
              <div className="stat-icon views">
                <FaEye />
              </div>
              <div className="stat-content">
                <h3>
                  {viewsLoading ? (
                    <Spin size="small" />
                  ) : (
                    jobDetails.statistics.views ?? "0"
                  )}
                </h3>
                <p>Lượt xem</p>
              </div>
            </div>
            <div className="stat-item">
              <div className="stat-icon applicants">
                <FaUsers />
              </div>
              <div className="stat-content">
                <h3>{jobDetails.statistics?.applicants}</h3>
                <p>Ứng viên</p>
              </div>
            </div>
            <div className="stat-item">
              <div className="stat-icon shortlisted">
                <FaStar />
              </div>
              <div className="stat-content">
                <h3>{jobDetails.statistics?.shortlisted}</h3>
                <p>Được chọn</p>
              </div>
            </div>
          </div>

          <div className="progress-section">
            <h4>Tiến độ tuyển dụng</h4>
            <div className="progress-item">
              <span>Tỷ lệ ứng tuyển</span>
              <Progress
                percent={jobDetails.statistics?.applicationRate || 0}
                strokeColor={{
                  "0%": "rgb(13, 71, 161)",
                  "100%": "rgb(30, 136, 229)",
                }}
              />
            </div>
            <div className="progress-item">
              <span>Tỷ lệ phù hợp</span>
              <Progress
                percent={jobDetails.statistics?.properRatio || 0}
                strokeColor={{
                  "0%": "rgb(13, 71, 161)",
                  "100%": "rgb(30, 136, 229)",
                }}
              />
            </div>
          </div>

          {/* <Timeline className="recruitment-timeline">
            <Timeline.Item color="green">Đăng tuyển - 15/01/2024</Timeline.Item>
            <Timeline.Item color="blue">
              Tiếp nhận hồ sơ - 20/01/2024
            </Timeline.Item>
            <Timeline.Item color="orange">
              Phỏng vấn vòng 1 - 25/01/2024
            </Timeline.Item>
            <Timeline.Item>Phỏng vấn vòng 2 - Dự kiến 01/02/2024</Timeline.Item>
          </Timeline> */}
        </div>
      ),
    },
    {
      key: "4",
      label: "Link ứng tuyển",
      children: (
        <div className="application-link-section">
          <div className="link-container">
            <div className="link-header">
              <FaLink className="link-icon" />
              <h4>Liên kết ứng tuyển trực tiếp</h4>
            </div>
            <div className="link-description">
              <p>
                Chia sẻ link này để ứng viên có thể ứng tuyển trực tiếp vào vị
                trí này:
              </p>
            </div>
            <div className="link-display">
              <div className="link-input">
                <input
                  type="text"
                  readOnly
                  value={`${window.location.origin}/apply/${jobDetails.jobCode}`}
                  className="link-text"
                />
                <Button
                  type="primary"
                  icon={<FaCopy />}
                  onClick={handleCopyApplicationLink}
                  className="copy-btn"
                >
                  Sao chép
                </Button>
              </div>
            </div>
            <div className="link-actions">
              <Button
                type="default"
                icon={<FaLink />}
                onClick={() =>
                  window.open(
                    `${window.location.origin}/apply/${jobDetails.jobCode}`,
                    "_blank"
                  )
                }
                className="preview-btn"
              >
                Xem trước trang ứng tuyển
              </Button>
              <Button
                type="primary"
                icon={<FaShareAlt />}
                onClick={handleShareJob}
                className="share-btn"
              >
                Chia sẻ
              </Button>
            </div>
            <div className="link-info">
              <div className="info-item">
                <span className="info-label">Trạng thái:</span>
                <Badge
                  color={getStatusColor(jobDetails.status)}
                  text={getStatusText(jobDetails.status)}
                />
              </div>
              <div className="info-item">
                <span className="info-label">Số lượng ứng tuyển qua link:</span>
                <span className="info-value">
                  {jobDetails.statistics?.applicants} ứng viên
                </span>
              </div>
              <div className="info-item">
                <span className="info-label">Lượt xem trang ứng tuyển:</span>
                <span className="info-value">
                  {jobDetails.statistics.views} lượt
                </span>
              </div>
            </div>
          </div>
        </div>
      ),
    },
  ];

  return (
    <Modal
      open={open}
      onCancel={onClose}
      footer={null}
      width={1000}
      className="job-detail-modal"
      title={null}
    >
      <div className="job-detail-container">
        {/* Header */}
        <div className="job-detail-header">
          <div className="job-header-content">
            <div className="job-title-section">
              <h1 className="job-title-detail">{jobDetails.jobTitle}</h1>
              <div className="job-meta">
                <Badge
                  color={getStatusColor(jobDetails.status)}
                  text={getStatusText(jobDetails.status)}
                  className="status-badge"
                />
                <span className="company-name">
                  <FaBuilding /> {companyInfo.companyName}
                </span>
              </div>
            </div>

            <div className="job-actions-header">
              <Button
                icon={<MdAutoDelete />}
                className="action-btn save-btn"
                onClick={handleDeleteJob}
              >
                Xóa
              </Button>
              <Button
                icon={<FaShareAlt />}
                className="action-btn share-btn"
                onClick={handleShareJob}
              >
                Chia sẻ
              </Button>
              <Button icon={<FaEdit />} className="action-btn edit-btn">
                Chỉnh sửa
              </Button>
            </div>
          </div>
        </div>

        {/* Quick Info */}
        <div className="job-quick-info">
          <div className="info-row">
            <div className="info-card">
              <FaMapMarkerAlt className="info-icon" />
              <div className="info-text">
                <span className="info-label">Địa điểm</span>
                <span className="info-value">{jobDetails.address}</span>
              </div>
            </div>

            <div className="info-card">
              <FaMoneyBillWave className="info-icon" />
              <div className="info-text">
                <span className="info-label">Mức lương</span>
                <span className="info-value">
                  {" "}
                  {jobDetails.fromSalary}-{jobDetails.toSalary} Triệu VNĐ
                </span>
              </div>
            </div>

            <div className="info-card">
              <FaClock className="info-icon" />
              <div className="info-text">
                <span className="info-label">Kinh nghiệm</span>
                <span className="info-value">
                  {jobDetails.requireExperience}
                </span>
              </div>
            </div>

            {/* <div className="info-card">
              <FaCalendarAlt className="info-icon" />
              <div className="info-text">
                <span className="info-label">Hạn nộp</span>
                <span className="info-value">
                  {dayjs(jobDetails.expirationDate).format("DD/MM/YYYY")}
                </span>
              </div>
            </div> */}
          </div>
        </div>

        {/* Content Tabs */}
        <div className="job-detail-content">
          <Tabs
            defaultActiveKey="1"
            items={tabItems}
            className="job-detail-tabs"
          />
        </div>

        {/* Footer Actions */}
        <div className="job-detail-footer">
          <div className="footer-content">
            <div className="footer-info">
              <p>
                Đã có <strong>{jobDetails.statistics?.applicants}</strong> người
                ứng tuyển cho vị trí này
              </p>
            </div>
            <div className="footer-actions">
              <Button size="large" onClick={onClose} className="cancel-btn">
                Hủy
              </Button>
              <Button
                type="primary"
                size="large"
                className="apply-btn"
                onClick={handleApply}
              >
                Đóng ứng tuyển
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Job Share Modal */}
      <JobShareModal
        open={shareModalOpen}
        onClose={() => setShareModalOpen(false)}
        jobCode={jobDetails.jobCode ?? ""}
        jobId={String(jobDetails.id)}
        jobTitle={jobDetails.jobTitle ?? ""}
        onShareSuccess={() => {
          messageApi.success("Đã gửi yêu cầu chia sẻ công việc!");
        }}
      />
    </Modal>
  );
};

export default JobDetailModal;
