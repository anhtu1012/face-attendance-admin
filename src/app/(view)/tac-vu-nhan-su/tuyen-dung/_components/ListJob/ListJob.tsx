import { useState } from "react";
import {
  MdAttachMoney,
  MdCalendarToday,
  MdLocationOn,
  MdWork,
} from "react-icons/md";
import JobDetailModal from "../JobDetailModal/JobDetailModal";
import "./ListJob.scss";
import { getStatusClass, getStatusText } from "../../_utils/status";
import dayjs from "dayjs";

interface Job {
  id: number;
  jobTitle: string;
  positionName: string;
  jobDescription: string;
  status: string;
  createdAt: string;
  fromSalary?: string;
  toSalary?: string;
  address?: string;
  requireExperience?: string;
}

const fakeJobs: Job[] = [
  {
    id: 7,
    jobTitle: "Senior Frontend Developer",
    positionName: "Streamer",
    jobDescription:
      "<p>Phát triển giao diện người dùng với React, TypeScript và Next.js. Tham gia xây dựng các ứng dụng web hiện đại.</p>",
    status: "OPEN",
    createdAt: "2025-10-02T18:34:42.961Z",
    fromSalary: "200",
    toSalary: "200",
    address: "Tp.Thủ Đức",
    requireExperience: "3-5",
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
                <h3 className="job-title">{job.jobTitle}</h3>
                <span className="job-department">{job.positionName}</span>
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
                  <span className="job-info-text">
                    {job.requireExperience} năm
                  </span>
                </div>
                <div className="job-info-item">
                  <MdAttachMoney className="job-info-icon" />
                  <span className="job-info-text">
                    {job.fromSalary}-{job.toSalary} Triệu VNĐ
                  </span>
                </div>
              </div>

              <div className="job-info-row">
                <div className="job-info-item">
                  <MdLocationOn className="job-info-icon" />
                  <span className="job-info-text">{job.address}</span>
                </div>
                <div className="job-info-item">
                  <MdCalendarToday className="job-info-icon" />
                  <span className="job-info-text">
                    {dayjs(job.createdAt).format("DD/MM/YYYY")}
                  </span>
                </div>
              </div>

              <div className="job-description">
                <div
                  className="job-description-html"
                  dangerouslySetInnerHTML={{ __html: job.jobDescription }}
                />
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
