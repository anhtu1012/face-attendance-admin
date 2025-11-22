import { FilterQueryStringTypeItem } from "@/apis/ddd/repository.port";
import Cbutton from "@/components/basicUI/Cbutton";
import CInputLabel from "@/components/basicUI/CInputLabel";
import { JobItem } from "@/dtos/tac-vu-nhan-su/tuyen-dung/job/job.dto";
import JobServices from "@/services/tac-vu-nhan-su/tuyen-dung/job/job.service";
import { buildQuicksearchParams } from "@/utils/client/buildQuicksearchParams/buildQuicksearchParams";
import dayjs from "dayjs";
import React, { useState, useEffect } from "react";
import { BsSearch } from "react-icons/bs";
import {
  MdAttachMoney,
  MdCalendarToday,
  MdExpandMore,
  MdLocationOn,
  MdWork,
} from "react-icons/md";
import { FaUserCheck } from "react-icons/fa";
import { Badge } from "antd";
import { getStatusClass, getStatusText } from "../../_utils/status";
import FilterDropdown, { FilterValues } from "../FilterDropdown";
import JobDetailModal from "../JobDetailModal/JobDetailModal";
import ShareRequestsModal from "../ShareRequestsModal/ShareRequestsModal";
import { columnDefs } from "./column";
import "./ListJob.scss";

type ListJobProps = {
  onJobCardClick?: (
    jobId: number | null,
    jobCode: string | null
  ) => Promise<void> | void;
  newJobIds?: Set<string>;
  onClearNewBadge?: (jobId: string) => void;
};

function ListJob({ onJobCardClick, newJobIds, onClearNewBadge }: ListJobProps) {
  const [selectedJobId, setSelectedJobId] = useState<number | null>(null);
  const [clickEffect, setClickEffect] = useState<number | null>(null);
  const [jobDetailOpen, setJobDetailOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState<JobItem | null>(null);
  const [dataJobs, setDataJobs] = useState<JobItem[]>([]);
  const [fromValue, setFromValue] = useState<FilterValues | undefined>(
    undefined
  );
  const [shareRequestsOpen, setShareRequestsOpen] = useState(false);
  const [pendingRequestsCount, setPendingRequestsCount] = useState(0);
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

  const fetchDataJobs = async (
    value?: FilterValues,
    params?: string | undefined
  ) => {
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
      // compute start and end dates; if value is missing, fall back to last 1 month
      const startDefault = dayjs().subtract(1, "month");
      const endDefault = dayjs();
      // ensure ISO strings (backend expects ISO 8601)
      const fromDate = value?.fromDate
        ? dayjs(value.fromDate).toISOString()
        : startDefault.toISOString();
      const toDate = value?.toDate
        ? dayjs(value.toDate).toISOString()
        : endDefault.toISOString();

      const paramsObj: Record<string, string> = {
        fromDate,
        toDate,
      };

      // Chỉ thêm status vào params nếu có giá trị
      if (value?.status) {
        paramsObj.status = value.status;
      }
      const response = await JobServices.getJob(
        searchFilter,
        quickSearchText,
        paramsObj
      );
      setDataJobs(response.data || []);
    } catch (error) {
      console.log("Error fetching jobs:", error);
    }
  };

  const fetchPendingRequestsCount = async () => {
    try {
      const requests = await JobServices.getShareRequests();
      const pendingCount = requests.filter((req) => req.status === "pending").length;
      setPendingRequestsCount(pendingCount);
    } catch (error) {
      console.log("Error fetching share requests count:", error);
    }
  };

  useEffect(() => {
    // Fetch pending requests count when component mounts
    fetchPendingRequestsCount();

    // Refresh count every 30 seconds
    const interval = setInterval(fetchPendingRequestsCount, 30000);
    return () => clearInterval(interval);
  }, []);

  // Listen for global 'jobCreated' events so this list can refresh automatically
  useEffect(() => {
    const handler = () => {
      try {
        // When a job is created elsewhere, re-fetch with current filters
        fetchDataJobs(fromValue);
      } catch (err) {
        console.warn("Error handling jobCreated event", err);
      }
    };

    window.addEventListener("jobCreated", handler);
    return () => {
      window.removeEventListener("jobCreated", handler);
    };
  }, [fromValue]);
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
  const handleJobCardClick = (jobId: number, jobCode: string) => {
    // Tạo hiệu ứng click
    setClickEffect(jobId);

    // Reset hiệu ứng sau 300ms
    setTimeout(() => {
      setClickEffect(null);
    }, 300);

    // Clear new badge when job is clicked
    if (onClearNewBadge && newJobIds?.has(String(jobId))) {
      onClearNewBadge(String(jobId));
    }

    // Toggle selection
    setSelectedJobId(selectedJobId === jobId ? null : jobId);
    try {
      const newSelected = selectedJobId === jobId ? null : jobId;
      setTimeout(() => {
        try {
          onJobCardClick?.(newSelected, jobCode);
        } catch {}
      }, 0);
    } catch {}
  };

  const handleViewJobDetail = (job: JobItem) => {
    // When user explicitly opens job detail, clear the "New" badge for that job
    if (onClearNewBadge) {
      try {
        onClearNewBadge(String(job.id));
      } catch {}
    }
    setSelectedJob(job);
    setJobDetailOpen(true);
  };

  const handleCloseJobDetail = () => {
    setJobDetailOpen(false);
    setSelectedJob(null);
  };

  const handleCloseJob = async (job: JobItem) => {
    try {
      await JobServices.updateJob(String(job.id), { status: "CLOSED" });
      fetchDataJobs(fromValue);
    } catch (error) {
      // Try to log axios-style response message when available, otherwise fall back to Error.message or the raw error.
      if (typeof error === "object" && error !== null && "response" in error) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const errAny = error as any;
        console.log(errAny.response?.data?.message ?? errAny.message ?? errAny);
      } else if (error instanceof Error) {
        console.log(error.message);
      } else {
        console.log(error);
      }
    }
  };

  return (
    <div className="list-job-container">
      <div className="search_job-list">
        <CInputLabel
          label="Tìm kiếm nhanh"
          onChange={(e) => fetchDataJobs(fromValue, e.target.value)}
          suffix={
            <>
              <BsSearch />
            </>
          }
        />

        <div>
          <FilterDropdown
            onFilter={(value) => {
              setFromValue(value);
              fetchDataJobs(value);
            }}
            statusOptions={[
              {
                label: "Tất cả",
                value: "",
              },
              {
                label: "Đang tuyển",
                value: "OPEN",
              },
              { label: "Đã đóng", value: "CLOSED" },
            ]}
          />
        </div>

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

        <div>
          <Badge count={pendingRequestsCount} offset={[-5, 5]}>
            <Cbutton
              className="share-requests-button"
              onClick={() => setShareRequestsOpen(true)}
              title="Yêu cầu chia sẻ công việc"
            >
              <FaUserCheck />
            </Cbutton>
          </Badge>
        </div>
      </div>
      <div className="job-list">
        {dataJobs.map((job) => (
          <div
            key={job.id}
            className={`job-card ${
              selectedJobId === Number(job.id) ? "selected" : ""
            } ${clickEffect === Number(job.id) ? "click-effect" : ""}`}
            onClick={() =>
              handleJobCardClick(Number(job.id), job.jobCode ?? "")
            }
          >
            <div className="job-card-header">
              <div className="job-title-section">
                <h3 className="job-title">{job.jobTitle}</h3>
                <span className="job-department">{job.positionName}</span>
                {newJobIds?.has(String(job.id)) && (
                  <span className="new-badge">New</span>
                )}
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
                    {Number(job.requireExperience) === 0 ||
                    !job.requireExperience
                      ? "Không Cần KN"
                      : `${job.requireExperience} năm`}
                  </span>
                </div>
                <div className="job-info-item">
                  <MdAttachMoney className="job-info-icon" />
                  <span className="job-info-text">
                    {Number(job.fromSalary) === 0 && Number(job.toSalary) === 0
                      ? "Lương thỏa thuận"
                      : `${job.fromSalary}-${job.toSalary} Triệu VNĐ`}
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
                    {dayjs(job.expirationDate).format("DD/MM/YYYY")}
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
                <button
                  className="btn-primary"
                  onClick={() => handleCloseJob(job)}
                >
                  Đóng Tuyển Dụng
                </button>
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

      {/* Share Requests Modal */}
      <ShareRequestsModal
        open={shareRequestsOpen}
        onClose={() => setShareRequestsOpen(false)}
        onRequestUpdate={() => {
          // Refresh pending requests count
          fetchPendingRequestsCount();
          // Optionally refresh job list when requests are updated
          fetchDataJobs(fromValue);
        }}
      />
    </div>
  );
}

export default ListJob;
