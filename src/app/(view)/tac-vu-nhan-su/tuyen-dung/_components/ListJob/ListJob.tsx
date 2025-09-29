import { useState } from "react";
import {
  MdAttachMoney,
  MdCalendarToday,
  MdLocationOn,
  MdWork,
} from "react-icons/md";
import JobDetailModal from "../JobDetailModal/JobDetailModal";
import "./ListJob.scss";

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

const fakeJobs: Job[] = [
  {
    id: 1,
    title: "Senior Frontend Developer",
    position: "Developer",
    description:
      "Phát triển giao diện người dùng với React, TypeScript và Next.js. Tham gia xây dựng các ứng dụng web hiện đại.",
    status: "Active",
    createdAt: "2024-01-15",
    salary: "25-35 triệu VNĐ",
    location: "Hà Nội",
    department: "IT Development",
  },
  {
    id: 2,
    title: "Backend Developer",
    position: "Developer",
    description:
      "Xây dựng và duy trì hệ thống backend với Node.js, Express và MongoDB. Thiết kế API RESTful.",
    status: "Pending",
    createdAt: "2024-01-10",
    salary: "20-30 triệu VNĐ",
    location: "TP.HCM",
    department: "IT Development",
  },
  {
    id: 3,
    title: "UI/UX Designer",
    position: "Designer",
    description:
      "Thiết kế trải nghiệm người dùng và giao diện trực quan. Sử dụng Figma, Adobe Creative Suite.",
    status: "Active",
    createdAt: "2024-01-08",
    salary: "18-25 triệu VNĐ",
    location: "Hà Nội",
    department: "Design",
  },
  {
    id: 4,
    title: "Project Manager",
    position: "Manager",
    description:
      "Quản lý dự án, điều phối nhóm phát triển. Đảm bảo tiến độ và chất lượng sản phẩm.",
    status: "Closed",
    createdAt: "2023-12-20",
    salary: "30-40 triệu VNĐ",
    location: "Remote",
    department: "Management",
  },
  {
    id: 5,
    title: "DevOps Engineer",
    position: "Engineer",
    description:
      "Quản lý hạ tầng cloud, CI/CD pipeline. Kinh nghiệm với AWS, Docker, Kubernetes.",
    status: "Active",
    createdAt: "2024-01-12",
    salary: "28-38 triệu VNĐ",
    location: "Hybrid",
    department: "Infrastructure",
  },
  {
    id: 6,
    title: "Mobile Developer",
    position: "Developer",
    description:
      "Phát triển ứng dụng di động với React Native hoặc Flutter. Tối ưu hóa hiệu suất ứng dụng.",
    status: "Pending",
    createdAt: "2024-01-05",
    salary: "22-32 triệu VNĐ",
    location: "TP.HCM",
    department: "Mobile",
  },
];

function ListJob() {
  const [selectedJobId, setSelectedJobId] = useState<number | null>(null);
  const [clickEffect, setClickEffect] = useState<number | null>(null);
  const [jobDetailOpen, setJobDetailOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);

  const handleJobCardClick = (jobId: number) => {
    // Tạo hiệu ứng click
    setClickEffect(jobId);

    // Reset hiệu ứng sau 300ms
    setTimeout(() => {
      setClickEffect(null);
    }, 300);

    // Toggle selection
    setSelectedJobId(selectedJobId === jobId ? null : jobId);
  };

  const handleViewJobDetail = (job: Job) => {
    setSelectedJob(job);
    setJobDetailOpen(true);
  };

  const handleCloseJobDetail = () => {
    setJobDetailOpen(false);
    setSelectedJob(null);
  };

  const getStatusClass = (status: string) => {
    switch (status.toLowerCase()) {
      case "active":
        return "active";
      case "pending":
        return "pending";
      case "closed":
        return "closed";
      default:
        return "";
    }
  };

  const getStatusText = (status: string) => {
    switch (status.toLowerCase()) {
      case "active":
        return "Đang tuyển";
      case "pending":
        return "Chờ duyệt";
      case "closed":
        return "Đã đóng";
      default:
        return status;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  return (
    <div className="list-job-container">
      <div className="job-list">
        {fakeJobs.map((job) => (
          <div
            key={job.id}
            className={`job-card ${
              selectedJobId === job.id ? "selected" : ""
            } ${clickEffect === job.id ? "click-effect" : ""}`}
            onClick={() => handleJobCardClick(job.id)}
          >
            <div className="job-card-header">
              <div className="job-title-section">
                <h3 className="job-title">{job.title}</h3>
                <span className="job-department">{job.department}</span>
              </div>
              <div className="job-status-section">
                <span className={`job-status ${getStatusClass(job.status)}`}>
                  {getStatusText(job.status)}
                </span>
              </div>
            </div>

            <div className="job-card-body">
              <div className="job-info-row">
                <div className="job-info-item">
                  <MdWork className="job-info-icon" />
                  <span className="job-info-text">{job.position}</span>
                </div>
                <div className="job-info-item">
                  <MdAttachMoney className="job-info-icon" />
                  <span className="job-info-text">{job.salary}</span>
                </div>
              </div>

              <div className="job-info-row">
                <div className="job-info-item">
                  <MdLocationOn className="job-info-icon" />
                  <span className="job-info-text">{job.location}</span>
                </div>
                <div className="job-info-item">
                  <MdCalendarToday className="job-info-icon" />
                  <span className="job-info-text">
                    {formatDate(job.createdAt)}
                  </span>
                </div>
              </div>

              <div className="job-description">
                <p>{job.description}</p>
              </div>
            </div>

            <div className="job-card-footer">
              <div className="job-actions">
                <button className="btn-primary">Đóng Tuyển Dụng</button>
                <button
                  className="btn-secondary"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleViewJobDetail(job);
                  }}
                >
                  {" "}
                  Xem chi tiết
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Job Detail Modal */}
      <JobDetailModal
        open={jobDetailOpen}
        onClose={handleCloseJobDetail}
        job={selectedJob}
      />
    </div>
  );
}

export default ListJob;
