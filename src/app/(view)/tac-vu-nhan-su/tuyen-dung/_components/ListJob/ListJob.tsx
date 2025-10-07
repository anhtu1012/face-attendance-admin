import { FilterQueryStringTypeItem } from "@/apis/ddd/repository.port";
import { JobItem } from "@/dtos/tac-vu-nhan-su/tuyen-dung/job/job.dto";
import JobServices from "@/services/tac-vu-nhan-su/tuyen-dung/job/job.service";
import dayjs from "dayjs";
import React, { useEffect, useState } from "react";
import {
  MdAttachMoney,
  MdCalendarToday,
  MdLocationOn,
  MdWork,
  MdExpandMore,
} from "react-icons/md";
import { getStatusClass, getStatusText } from "../../_utils/status";
import JobDetailModal from "../JobDetailModal/JobDetailModal";
import "./ListJob.scss";
import CInputLabel from "@/components/basicUI/CInputLabel";
import { BsSearch } from "react-icons/bs";
import { columnDefs } from "./column";
import { buildQuicksearchParams } from "@/utils/client/buildQuicksearchParams/buildQuicksearchParams";
import Cbutton from "@/components/basicUI/Cbutton";

type ListJobProps = {
  onJobCardClick?: (jobId: number | null) => Promise<void> | void;
};

function ListJob({ onJobCardClick }: ListJobProps) {
  const [selectedJobId, setSelectedJobId] = useState<number | null>(null);
  const [clickEffect, setClickEffect] = useState<number | null>(null);
  const [jobDetailOpen, setJobDetailOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState<JobItem | null>(null);
  const [dataJobs, setDataJobs] = useState<JobItem[]>([]);
  // track collapsed state per job id
  const [collapsedJobs, setCollapsedJobs] = useState<Set<number>>(new Set());

  const toggleCollapseAll = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (!dataJobs || dataJobs.length === 0) return;
    // If all are collapsed, expand all. Otherwise collapse all.
    const allCollapsed = dataJobs.every((j) => collapsedJobs.has(Number(j.id)));
    if (allCollapsed) {
      setCollapsedJobs(new Set());
    } else {
      setCollapsedJobs(new Set(dataJobs.map((j) => Number(j.id))));
    }
  };

  const fetchDataJobs = async (params: string | undefined) => {
    const selectedFilterColumns = columnDefs
      .map((col) => col.field)
      .filter(Boolean) as string[];
    const quickSearchText = buildQuicksearchParams(
      params ?? "",
      selectedFilterColumns,
      "",
      columnDefs
    );
    try {
      const searchFilter: FilterQueryStringTypeItem[] = [];
      const response = await JobServices.getJob(searchFilter, quickSearchText);
      setDataJobs(response.data || []);
    } catch (error) {
      console.log("Error fetching jobs:", error);
    }
  };
  useEffect(() => {
    fetchDataJobs(undefined);
  }, []);

  const toggleCollapse = (e: React.MouseEvent, jobId: number) => {
    // prevent card click/select when toggling
    e.stopPropagation();
    setCollapsedJobs((prev) => {
      const next = new Set(prev);
      if (next.has(jobId)) next.delete(jobId);
      else next.add(jobId);
      return next;
    });
  };
  const handleJobCardClick = (jobId: number) => {
    // Tạo hiệu ứng click
    setClickEffect(jobId);

    // Reset hiệu ứng sau 300ms
    setTimeout(() => {
      setClickEffect(null);
    }, 300);

    // Toggle selection
    setSelectedJobId(selectedJobId === jobId ? null : jobId);
    try {
      const newSelected = selectedJobId === jobId ? null : jobId;
      setTimeout(() => {
        try {
          onJobCardClick?.(newSelected);
        } catch {}
      }, 0);
    } catch {}
  };

  const handleViewJobDetail = (job: JobItem) => {
    setSelectedJob(job);
    setJobDetailOpen(true);
  };

  const handleCloseJobDetail = () => {
    setJobDetailOpen(false);
    setSelectedJob(null);
  };

  return (
    <div className="list-job-container">
      <div className="search_job-list">
        <CInputLabel
          label="Tìm kiếm"
          onChange={(e) => fetchDataJobs(e.target.value)}
          suffix={
            <>
              <BsSearch />
            </>
          }
        />
        <div>
          <Cbutton
            className={`collapse-all-button ${
              dataJobs.length > 0 &&
              dataJobs.every((j) => collapsedJobs.has(Number(j.id)))
                ? "collapsed"
                : ""
            }`}
            onClick={(e: React.MouseEvent<HTMLButtonElement>) =>
              toggleCollapseAll(e)
            }
            title={
              dataJobs.length > 0 &&
              dataJobs.every((j) => collapsedJobs.has(Number(j.id)))
                ? "Mở tất cả"
                : "Thu gọn tất cả"
            }
            aria-pressed={
              dataJobs.length > 0 &&
              dataJobs.every((j) => collapsedJobs.has(Number(j.id)))
            }
          >
            <MdExpandMore />
          </Cbutton>
        </div>
      </div>
      <div className="job-list">
        {dataJobs.map((job) => (
          <div
            key={job.id}
            className={`job-card ${
              selectedJobId === Number(job.id) ? "selected" : ""
            } ${clickEffect === Number(job.id) ? "click-effect" : ""}`}
            onClick={() => handleJobCardClick(Number(job.id))}
          >
            <div className="job-card-header">
              <div className="job-title-section">
                <h3 className="job-title">{job.jobTitle}</h3>
                <span className="job-department">{job.positionName}</span>
              </div>
              <div className="job-header-controls">
                <button
                  className={`collapse-toggle ${
                    collapsedJobs.has(Number(job.id)) ? "collapsed" : ""
                  }`}
                  onClick={(e) => toggleCollapse(e, Number(job.id))}
                  aria-expanded={!collapsedJobs.has(Number(job.id))}
                  title={collapsedJobs.has(Number(job.id)) ? "Mở" : "Thu gọn"}
                >
                  <MdExpandMore />
                </button>
              </div>
              <div className="job-status-section">
                <span className={`job-status ${getStatusClass(job.status)}`}>
                  {getStatusText(job.status)}
                </span>
              </div>
            </div>

            <div
              className={`job-card-body ${
                collapsedJobs.has(Number(job.id)) ? "collapsed" : "expanded"
              }`}
            >
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
                  dangerouslySetInnerHTML={{ __html: job.jobDescription ?? "" }}
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
        jobCode={selectedJob?.jobCode ?? ""}
      />
    </div>
  );
}

export default ListJob;
