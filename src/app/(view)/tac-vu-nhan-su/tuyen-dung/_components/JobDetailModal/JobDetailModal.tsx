import React from "react";
import { Modal, Button, Badge, Timeline, Progress, Tabs, message } from "antd";
import {
  FaMapMarkerAlt,
  FaMoneyBillWave,
  FaClock,
  FaBuilding,
  FaUsers,
  FaBriefcase,
  FaGraduationCap,
  FaCalendarAlt,
  FaEye,
  FaHeart,
  FaShareAlt,
  FaEdit,
  FaStar,
  FaLink,
  FaCopy,
} from "react-icons/fa";
import { MdEmail, MdPhone } from "react-icons/md";
import "./JobDetailModal.scss";

interface Job {
  id: number;
  title: string;
  position: string;
  description: string;
  status: string;
  createdAt: string;
  salary?: string;
  location?: string;
  department?: string;
}

interface JobDetailModalProps {
  open: boolean;
  onClose: () => void;
  job: Job | null;
}

const JobDetailModal: React.FC<JobDetailModalProps> = ({
  open,
  onClose,
  job,
}) => {
  if (!job) return null;

  // Mock detailed data
  const jobDetails = {
    ...job,
    company: "FaceAI Technology Solutions",
    employmentType: "Toàn thời gian",
    experience: "3-5 năm",
    deadline: "2024-03-15",
    benefits:
      "<ul><li>Lương thưởng hấp dẫn theo năng lực</li><li>Bảo hiểm sức khỏe cao cấp</li><li>Thưởng hiệu suất định kỳ</li><li>Du lịch hàng năm cùng công ty</li><li>Cơ hội thăng tiến rõ ràng</li><li>Môi trường làm việc hiện đại</li></ul>",
    requirements:
      "<ul><li>Kinh nghiệm 3+ năm với React, TypeScript</li><li>Thành thạo Next.js, Redux Toolkit</li><li>Hiểu biết về UI/UX principles</li><li>Kinh nghiệm với RESTful API</li><li>Khả năng làm việc nhóm tốt</li><li>Tiếng Anh giao tiếp cơ bản</li></ul>",
    responsibilities:
      "<ul><li>Phát triển các tính năng frontend mới</li><li>Tối ưu hóa hiệu suất ứng dụng</li><li>Review code và mentor junior developers</li><li>Tham gia vào quy trình CI/CD</li><li>Hợp tác với team Backend và Design</li></ul>",
    recruiter: {
      name: "Nguyễn Thị Lan Anh",
      position: "HR Manager",
      email: "lananh.nguyen@faceai.vn",
      phone: "0912-345-678",
    },
    statistics: {
      views: 245,
      applicants: 32,
      shortlisted: 8,
    },
    skillsRequired: ["React", "TypeScript", "Next.js", "SCSS", "Git", "Agile"],
    workingHours: "8:00 - 17:30 (T2-T6)",
    probationPeriod: "2 tháng",
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "active":
        return "#52c41a";
      case "pending":
        return "#faad14";
      case "closed":
        return "#f5222d";
      default:
        return "#d9d9d9";
    }
  };

  const getStatusText = (status: string) => {
    switch (status.toLowerCase()) {
      case "active":
        return "Đang tuyển dụng";
      case "pending":
        return "Chờ phê duyệt";
      case "closed":
        return "Đã đóng";
      default:
        return status;
    }
  };

  const handleApply = () => {
    // Create job application link
    const applicationLink = `${window.location.origin}/apply/${job.id}`;

    // Open in new tab
    window.open(applicationLink, "_blank");

    console.log("Apply for job:", job.id);
    console.log("Application link:", applicationLink);
  };

  const handleCopyApplicationLink = async () => {
    const applicationLink = `${window.location.origin}/apply/${job.id}`;

    try {
      await navigator.clipboard.writeText(applicationLink);
      message.success("Đã sao chép link ứng tuyển!");
    } catch (error) {
      console.error("Error copying link:", error);
      message.error("Không thể sao chép link!");
    }
  };

  const handleSaveJob = () => {
    // Handle save job logic
    console.log("Save job:", job.id);
  };

  const handleShareJob = () => {
    // Handle share job logic
    console.log("Share job:", job.id);
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
              dangerouslySetInnerHTML={{ __html: jobDetails.responsibilities }}
            />
          </div>

          <div className="content-block">
            <h4>
              <FaGraduationCap /> Yêu cầu ứng viên
            </h4>
            <div
              className="content"
              dangerouslySetInnerHTML={{ __html: jobDetails.requirements }}
            />
          </div>

          <div className="content-block">
            <h4>
              <FaStar /> Quyền lợi
            </h4>
            <div
              className="content"
              dangerouslySetInnerHTML={{ __html: jobDetails.benefits }}
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
            <div className="info-item">
              <span className="info-label">Hình thức làm việc:</span>
              <span className="info-value">{jobDetails.employmentType}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Thời gian làm việc:</span>
              <span className="info-value">{jobDetails.workingHours}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Thời gian thử việc:</span>
              <span className="info-value">{jobDetails.probationPeriod}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Hạn nộp hồ sơ:</span>
              <span className="info-value highlight">
                {jobDetails.deadline}
              </span>
            </div>
          </div>

          <div className="skills-section">
            <h4>Kỹ năng yêu cầu</h4>
            <div className="skills-tags">
              {jobDetails.skillsRequired.map((skill, index) => (
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
                <h5>{jobDetails.recruiter.name}</h5>
                <p>{jobDetails.recruiter.position}</p>
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
                <h3>{jobDetails.statistics.views}</h3>
                <p>Lượt xem</p>
              </div>
            </div>
            <div className="stat-item">
              <div className="stat-icon applicants">
                <FaUsers />
              </div>
              <div className="stat-content">
                <h3>{jobDetails.statistics.applicants}</h3>
                <p>Ứng viên</p>
              </div>
            </div>
            <div className="stat-item">
              <div className="stat-icon shortlisted">
                <FaStar />
              </div>
              <div className="stat-content">
                <h3>{jobDetails.statistics.shortlisted}</h3>
                <p>Được chọn</p>
              </div>
            </div>
          </div>

          <div className="progress-section">
            <h4>Tiến độ tuyển dụng</h4>
            <div className="progress-item">
              <span>Tỷ lệ ứng tuyển</span>
              <Progress
                percent={75}
                strokeColor={{
                  "0%": "rgb(13, 71, 161)",
                  "100%": "rgb(30, 136, 229)",
                }}
              />
            </div>
            <div className="progress-item">
              <span>Tỷ lệ phù hợp</span>
              <Progress
                percent={60}
                strokeColor={{
                  "0%": "rgb(13, 71, 161)",
                  "100%": "rgb(30, 136, 229)",
                }}
              />
            </div>
          </div>

          <Timeline className="recruitment-timeline">
            <Timeline.Item color="green">Đăng tuyển - 15/01/2024</Timeline.Item>
            <Timeline.Item color="blue">
              Tiếp nhận hồ sơ - 20/01/2024
            </Timeline.Item>
            <Timeline.Item color="orange">
              Phỏng vấn vòng 1 - 25/01/2024
            </Timeline.Item>
            <Timeline.Item>Phỏng vấn vòng 2 - Dự kiến 01/02/2024</Timeline.Item>
          </Timeline>
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
                  value={`${window.location.origin}/apply/${job.id}`}
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
                    `${window.location.origin}/apply/${job.id}`,
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
                  {jobDetails.statistics.applicants} ứng viên
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
              <h1 className="job-title-detail">{job.title}</h1>
              <div className="job-meta">
                <Badge
                  color={getStatusColor(job.status)}
                  text={getStatusText(job.status)}
                  className="status-badge"
                />
                <span className="company-name">
                  <FaBuilding /> {jobDetails.company}
                </span>
              </div>
            </div>

            <div className="job-actions-header">
              <Button
                icon={<FaHeart />}
                className="action-btn save-btn"
                onClick={handleSaveJob}
              >
                Lưu
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
                <span className="info-value">{job.location}</span>
              </div>
            </div>

            <div className="info-card">
              <FaMoneyBillWave className="info-icon" />
              <div className="info-text">
                <span className="info-label">Mức lương</span>
                <span className="info-value">{job.salary}</span>
              </div>
            </div>

            <div className="info-card">
              <FaClock className="info-icon" />
              <div className="info-text">
                <span className="info-label">Kinh nghiệm</span>
                <span className="info-value">{jobDetails.experience}</span>
              </div>
            </div>

            <div className="info-card">
              <FaCalendarAlt className="info-icon" />
              <div className="info-text">
                <span className="info-label">Hạn nộp</span>
                <span className="info-value">{jobDetails.deadline}</span>
              </div>
            </div>
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
                Đã có <strong>{jobDetails.statistics.applicants}</strong> người
                ứng tuyển cho vị trí này
              </p>
            </div>
            <div className="footer-actions">
              <Button size="large" onClick={onClose} className="cancel-btn">
                Đóng
              </Button>
              <Button
                type="primary"
                size="large"
                className="apply-btn"
                onClick={handleApply}
              >
                Ứng tuyển ngay
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default JobDetailModal;
