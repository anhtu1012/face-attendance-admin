/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import LayoutContent from "@/components/LayoutContentForder/layoutContent";
import AppointmentWeeklyView from "@/components/ViewComponent/AppointmentWeeklyView";
import { JobOfferItem } from "@/dtos/tac-vu-nhan-su/phong-van-nhan-viec/job-offer.dto";
import { showError } from "@/hooks/useNotification";
import JobOfferServices from "@/services/tac-vu-nhan-su/phong-van-nhan-viec/job-offer.service";
import { Tabs } from "antd";
import dayjs from "dayjs";
import isoWeek from "dayjs/plugin/isoWeek";
import { useCallback, useEffect, useMemo, useState } from "react";
import FilterDropdown from "../_components/FilterDropdown/FilterDropdown";
import "../_components/FilterDropdown/FilterDropdown.scss";
import { FilterValues } from "./_types/filter.types";
import "./index.scss";
import TuyenDungServices from "@/services/tac-vu-nhan-su/tuyen-dung/tuyen-dung.service";
import { AppointmentListWithInterview } from "@/dtos/tac-vu-nhan-su/phong-van-nhan-viec/appointment.dto";

dayjs.extend(isoWeek);

function Page() {
  const [interviewData, setInterviewData] = useState<
    AppointmentListWithInterview[]
  >([]);
  const [loadingInterviews, setLoadingInterviews] = useState(false);
  const [interviewFilters, setInterviewFilters] = useState<FilterValues>({});

  // Job offer states
  const [jobOfferData, setJobOfferData] = useState<JobOfferItem[]>([]);
  const [loadingJobOffers, setLoadingJobOffers] = useState(false);
  const [jobOfferFilters, setJobOfferFilters] = useState<FilterValues>({});
  console.log(
    "a",
    interviewData,
    jobOfferData,
    interviewFilters,
    jobOfferFilters
  );

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

  const jobOfferStatusOptions = useMemo(
    () => [
      { label: "Chờ xác nhận", value: "PENDING" },
      { label: "Chấp nhận", value: "ACCEPTED" },
      { label: "Từ chối", value: "REJECTED" },
      { label: "Hoàn thành", value: "COMPLETED" },
      { label: "Hủy bỏ", value: "CANCELLED" },
    ],
    []
  );

  const fetchInterviews = useCallback(async () => {
    setLoadingInterviews(true);

    try {
      const response = await TuyenDungServices.getDanhSachPhongVanWithParam(
        [],
        undefined
      );
      setInterviewData(response.data || []);
    } catch (error: any) {
      showError(
        error.response?.data?.message || "Lỗi khi tải danh sách phỏng vấn"
      );
    } finally {
      setLoadingInterviews(false);
    }
  }, []);

  useEffect(() => {
    fetchInterviews();
  }, [fetchInterviews]);

  // Fetch job offers
  const fetchJobOffers = useCallback(async () => {
    setLoadingJobOffers(true);
    try {
      const response = await JobOfferServices.getJobOffers();
      setJobOfferData(response.data || []);
    } catch (error: any) {
      showError(
        error.response?.data?.message || "Lỗi khi tải danh sách nhận việc"
      );
    } finally {
      setLoadingJobOffers(false);
    }
  }, []);

  useEffect(() => {
    fetchInterviews();
    fetchJobOffers();
  }, [fetchInterviews, fetchJobOffers]);

  // Filter handlers
  const handleInterviewFilter = (filters: FilterValues) => {
    setInterviewFilters(filters);
  };

  const handleJobOfferFilter = (filters: FilterValues) => {
    setJobOfferFilters(filters);
  };

  // Handle interview item click
  const handleInterviewClick = (item: any) => {
    // TODO: Open detail modal or navigate to detail page
    console.log("View interview details:", item.candidateName);
  };

  // Handle job offer item click
  const handleJobOfferClick = (item: any) => {
    // TODO: Open detail modal or navigate to detail page
    console.log("View job offer details:", item.candidateName);
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

  const tabItems = [
    {
      key: "interview",
      label: "Lịch phỏng vấn",
      children: (
        <div className="interview-tab-content">
          <>
            {" "}
            <AppointmentWeeklyView
              data={interviewData}
              dateRange={dateRange}
              type="interview"
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
        </div>
      ),
    },
    {
      key: "jobOffer",
      label: "Lịch nhận việc",
      children: (
        <div className="job-offer-tab-content">
          <AppointmentWeeklyView
            data={[]}
            dateRange={dateRange}
            type="jobOffer"
            onItemClick={handleJobOfferClick}
            statusOptions={jobOfferStatusOptions}
            filterDropdown={
              <FilterDropdown
                onFilter={handleJobOfferFilter}
                statusOptions={jobOfferStatusOptions}
                loading={loadingJobOffers}
              />
            }
          />
        </div>
      ),
    },
  ];

  return (
    <div className="phong-van-nhan-viec-page">
      <LayoutContent
        layoutType={1}
        option={{
          floatButton: true,
        }}
        content1={
          <div className="appointments-container">
            <Tabs
              defaultActiveKey="interview"
              items={tabItems}
              size="large"
              className="appointments-tabs"
            />
          </div>
        }
      />
    </div>
  );
}

export default Page;
