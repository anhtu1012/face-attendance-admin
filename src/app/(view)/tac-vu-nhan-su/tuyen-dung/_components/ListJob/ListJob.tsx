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
import Cselect from "@/components/Cselect";

type ListJobProps = {
  // Pass jobId and optional quantityStatus object when a job card is clicked
  onJobCardClick?: (
    jobId: number | null,
    quantityStatus?: Record<string, number> | null
  ) => Promise<void> | void;
  // Set of job IDs that have new candidates
  newJobIds?: Set<string>;
  // Callback to clear the new badge when job is clicked
  onClearNewBadge?: (jobId: string) => void;
};

function ListJob({ onJobCardClick, newJobIds, onClearNewBadge }: ListJobProps) {
  const [selectedJobId, setSelectedJobId] = useState<number | null>(null);
  const [clickEffect, setClickEffect] = useState<number | null>(null);
  const [jobDetailOpen, setJobDetailOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState<JobItem | null>(null);
  const [dataJobs, setDataJobs] = useState<JobItem[]>([]);
  // track collapsed state per job id
  const [collapsedJobs, setCollapsedJobs] = useState<Set<number>>(new Set());
  const [selectedMonth, setSelectedMonth] = useState<string>(
    dayjs().format("YYYY-MM")
  );

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

  const fetchDataJobs = async (month: string, params?: string | undefined) => {
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
      // compute start and end of month
      const fromDate = dayjs(month + "-01")
        .startOf("month")
        .toISOString();
      const toDate = dayjs(month + "-01")
        .endOf("month")
        .toISOString();
      const paramsObj: Record<string, string> = { fromDate, toDate };
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
  useEffect(() => {
    fetchDataJobs(selectedMonth);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // generate month options (last 12 months)
  const monthOptions = React.useMemo(() => {
    const opts: { label: string; value: string }[] = [];
    for (let i = 0; i < 12; i++) {
      const m = dayjs().subtract(i, "month");
      opts.push({
        label: `Tháng ${m.format("MM/YYYY")}`,
        value: m.format("YYYY-MM"),
      });
    }
    return opts;
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
  const handleJobCardClick = (
    jobId: number,
    quantityStatus?: Record<string, number> | null
  ) => {
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
          onJobCardClick?.(
            newSelected,
            newSelected ? quantityStatus ?? null : null
          );
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

  return (
    <div className="list-job-container">
      <div className="search_job-list">
        <CInputLabel
          label="Tìm kiếm nhanh"
          onChange={(e) => fetchDataJobs(selectedMonth, e.target.value)}
          suffix={
            <>
              <BsSearch />
            </>
          }
        />
        <Cselect
          label="Chọn tháng"
          style={{ width: "100%", height: "36px" }}
          value={selectedMonth}
          onChange={(val) => {
            const monthVal = String(val || "");
            setSelectedMonth(monthVal);
            fetchDataJobs(monthVal);
          }}
          options={monthOptions}
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
            onClick={() =>
              handleJobCardClick(Number(job.id), job.quantityStatus ?? null)
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
