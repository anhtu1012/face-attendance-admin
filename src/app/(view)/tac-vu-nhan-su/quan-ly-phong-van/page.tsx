"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */
import LayoutContent from "@/components/LayoutContentForder/layoutContent";
import AppointmentWeeklyView from "@/components/ViewComponent/AppointmentWeeklyView";
import { AppointmentItem } from "@/dtos/tac-vu-nhan-su/phong-van-nhan-viec/interview.dto";
import { showError } from "@/hooks/useNotification";
import InterviewServices from "@/services/tac-vu-nhan-su/phong-van-nhan-viec/interview.service";
import dayjs from "dayjs";
import { useCallback, useEffect, useMemo, useState } from "react";
import FilterDropdown from "../_components/FilterDropdown";
import { FilterValues } from "../phong-van-nhan-viec/_types/filter.types";
import {
  filterInterviewData,
  mockInterviewData,
} from "../phong-van-nhan-viec/_utils/mockData";
import "./page.scss";
function Page() {
  // Use mock data (comment these out when API is ready)
  const USE_MOCK_DATA = true;

  // Interview states
  const [interviewData, setInterviewData] = useState<AppointmentItem[]>([]);
  const [loadingInterviews, setLoadingInterviews] = useState(false);
  const [interviewFilters, setInterviewFilters] = useState<FilterValues>({});

  // Status options for filters
  const interviewStatusOptions = useMemo(
    () => [
      { label: "Chờ xác nhận", value: "PENDING" },
      { label: "Chấp nhận", value: "ACCEPTED" },
      { label: "Từ chối", value: "REJECTED" },
      { label: "Hoàn thành", value: "COMPLETED" },
      { label: "Hủy bỏ", value: "CANCELLED" },
    ],
    []
  );

  // Fetch interviews
  const fetchInterviews = useCallback(async () => {
    setLoadingInterviews(true);
    try {
      if (USE_MOCK_DATA) {
        // Simulate API delay
        await new Promise((resolve) => setTimeout(resolve, 500));
        setInterviewData(mockInterviewData);
      } else {
        const response = await InterviewServices.getInterviews();
        setInterviewData(response.data || []);
      }
    } catch (error: any) {
      showError(
        error.response?.data?.message || "Lỗi khi tải danh sách phỏng vấn"
      );
    } finally {
      setLoadingInterviews(false);
    }
  }, [USE_MOCK_DATA]);

  useEffect(() => {
    fetchInterviews();
  }, [fetchInterviews]);

  // Filter interview data
  const filteredInterviewData = useMemo(() => {
    return filterInterviewData(interviewData, interviewFilters);
  }, [interviewData, interviewFilters]);

  // Filter handlers
  const handleInterviewFilter = (filters: FilterValues) => {
    setInterviewFilters(filters);
  };

  // Handle interview item click
  const handleInterviewClick = (item: any) => {
    // TODO: Open detail modal or navigate to detail page
    console.log("View interview details:", item.candidateName);
  };

  // Compute date range from filters or default to current week
  const dateRange = useMemo(() => {
    if (interviewFilters.fromDate && interviewFilters.toDate) {
      return {
        start: dayjs(interviewFilters.fromDate),
        end: dayjs(interviewFilters.toDate),
      };
    }
    return {
      start: dayjs().startOf("isoWeek"),
      end: dayjs().endOf("isoWeek"),
    };
  }, [interviewFilters]);

  // Map interview data to appointment format
  const mappedInterviewData = useMemo(
    () =>
      filteredInterviewData.map((item) => ({
        id: item.id || "",
        candidateName: item.candidateName || "",
        date: item.interviewDate || "",
        startTime: item.startTime || "",
        endTime: item.endTime || "",
        status: item.status || "",
        jobTitle: item.jobTitle,
        department: item.department,
        interviewType: item.interviewType,
        location: item.location,
        meetingLink: item.meetingLink,
        interviewer: Array.isArray(item.interviewer)
          ? item.interviewer.map((i) => i.interviewerName).join(", ")
          : item.interviewer || "",
        notes: item.notes,
      })),
    [filteredInterviewData]
  );

  return (
    <div>
      <LayoutContent
        layoutType={1}
        content1={
          <>
            {" "}
            <AppointmentWeeklyView
              data={mappedInterviewData}
              dateRange={dateRange}
              type="interview"
              IsHumanPV
              onItemClick={handleInterviewClick}
              statusOptions={interviewStatusOptions}
              filterDropdown={
                <FilterDropdown
                  onFilter={handleInterviewFilter}
                  statusOptions={interviewStatusOptions}
                  loading={loadingInterviews}
                />
              }
            />
          </>
        }
      />
      <div className="pending-notice" role="status" aria-live="polite">
        <div className="pending-notice__content">
          Các lịch hẹn{" "}
          <strong style={{ fontSize: "15px", color: "orange" }}>
            CHỜ XÁC NHẬN
          </strong>{" "}
          phải được phản hồi sau{" "}
          <strong style={{ fontSize: "15px", color: "orange" }}>7 tiếng</strong>{" "}
          , nếu không phản hội hệ thổng sẽ{" "}
          <strong style={{ fontSize: "15px", color: "green" }}>
            TỰ ĐỘNG XÁC NHẬN
          </strong>{" "}
        </div>
      </div>
    </div>
  );
}

export default Page;
