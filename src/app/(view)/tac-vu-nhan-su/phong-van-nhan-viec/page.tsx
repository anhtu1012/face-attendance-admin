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
import {
  AppointmentListWithInterview,
  Interviewer,
} from "@/dtos/tac-vu-nhan-su/phong-van-nhan-viec/appointment.dto";
import { useSelector } from "react-redux";
import { selectAuthLogin } from "@/lib/store/slices/loginSlice";
import useSocket from "@/hooks/useSocket";

dayjs.extend(isoWeek);

function Page() {
  const [interviewData, setInterviewData] = useState<
    AppointmentListWithInterview[]
  >([]);
  const { userProfile } = useSelector(selectAuthLogin);
  const [loadingInterviews, setLoadingInterviews] = useState(false);
  const [interviewFilters, setInterviewFilters] = useState<FilterValues>({});

  // Job offer states
  const [jobOfferData, setJobOfferData] = useState<JobOfferItem[]>([]);
  const [loadingJobOffers, setLoadingJobOffers] = useState(false);
  const [jobOfferFilters, setJobOfferFilters] = useState<FilterValues>({});
  const socket = useSocket();
  useEffect(() => {
    if (!socket) return;

    const handleNewNotification = (payload: any) => {
      console.log("INTERVIEWER_APPOINTMENT_UPDATED received:", payload);

      const appointmentId = payload?.appointmentId;
      const appointmentStatus = payload?.status;
      const incomingInterviewer =
        payload?.interviewer && typeof payload.interviewer === "object"
          ? payload.interviewer
          : payload;

      // Nếu không có appointmentId thì không xử lý
      if (!appointmentId) return;

      if (!incomingInterviewer || !incomingInterviewer.interviewerId) return;

      setInterviewData((prev) =>
        prev.map((appt) => {
          if (String(appt.appointmentId) !== String(appointmentId)) return appt;
          if (!appt.listInterviewers || appt.listInterviewers.length === 0)
            return appt;

          // chỉ thay interviewer có id trùng, giữ nguyên các phần tử khác
          let matched = false;
          const newList = appt.listInterviewers.map((iv) => {
            if (
              String(iv.interviewerId) ===
              String(incomingInterviewer.interviewerId)
            ) {
              matched = true;
              // merge để giữ các trường cũ nếu cần
              return { ...iv, ...(incomingInterviewer as Interviewer) };
            }
            return iv;
          });

          if (!matched) return appt;

          return {
            ...appt,
            // nếu payload có status thì cập nhật vào appointment
            ...(appointmentStatus !== undefined
              ? { status: appointmentStatus }
              : {}),
            listInterviewers: newList,
          };
        })
      );
    };
    socket.on("INTERVIEWER_APPOINTMENT_UPDATED", handleNewNotification);

    return () => {
      socket.off("INTERVIEWER_APPOINTMENT_UPDATED", handleNewNotification);
    };
  }, [socket]);

  // Status options for filters
  const interviewStatusOptions = useMemo(
    () => [
      { label: "Chờ xác nhận", value: "PENDING" },
      { label: "Chấp nhận", value: "ACCEPTED" },
      { label: "Hoàn thành", value: "COMPLETED" },
      { label: "Người PV Từ chối", value: "REJECTED" },
      { label: "Hủy bỏ", value: "CANCELLED" },
    ],
    []
  );

  const jobOfferStatusOptions = useMemo(
    () => [
      { label: "Đang hoạt động", value: "ACTIVE" },
      { label: "Hoàn thành", value: "COMPLETED" },
      { label: "Hủy bỏ", value: "CANCELLED" },
    ],
    []
  );

  const fetchInterviews = useCallback(async () => {
    if (!userProfile?.userName) return;

    setLoadingInterviews(true);
    try {
      const param = {
        userName: userProfile.userName,
        fromDate: interviewFilters.fromDate
          ? dayjs(interviewFilters.fromDate).toISOString()
          : dayjs().startOf("isoWeek").toISOString(),
        toDate: interviewFilters.toDate
          ? dayjs(interviewFilters.toDate).toISOString()
          : dayjs().endOf("isoWeek").toISOString(),
      };
      const response = await TuyenDungServices.getDanhSachPhongVanWithParam(
        [],
        undefined,
        param
      );
      setInterviewData(response.data || []);
    } catch (error: any) {
      showError(
        error.response?.data?.message || "Lỗi khi tải danh sách phỏng vấn"
      );
    } finally {
      setLoadingInterviews(false);
    }
  }, [userProfile, interviewFilters]);

  // Fetch job offers
  const fetchJobOffers = useCallback(async () => {
    if (!userProfile?.id) return;

    setLoadingJobOffers(true);
    try {
      const param = {
        hrId: String(userProfile.id),
        fromDate: jobOfferFilters.fromDate
          ? dayjs(jobOfferFilters.fromDate).toISOString()
          : dayjs().startOf("isoWeek").toISOString(),
        toDate: jobOfferFilters.toDate
          ? dayjs(jobOfferFilters.toDate).toISOString()
          : dayjs().endOf("isoWeek").toISOString(),
      };
      const response = await JobOfferServices.getJobOffers(
        [],
        undefined,
        param
      );
      setJobOfferData(response.data || []);
    } catch (error: any) {
      showError(
        error.response?.data?.message || "Lỗi khi tải danh sách nhận việc"
      );
    } finally {
      setLoadingJobOffers(false);
    }
  }, [userProfile, jobOfferFilters]);

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
  const interviewDateRange = useMemo(() => {
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

  const jobOfferDateRange = useMemo(() => {
    if (jobOfferFilters.fromDate && jobOfferFilters.toDate) {
      return {
        start: dayjs(jobOfferFilters.fromDate),
        end: dayjs(jobOfferFilters.toDate),
      };
    }
    return {
      start: dayjs().startOf("isoWeek"),
      end: dayjs().endOf("isoWeek"),
    };
  }, [jobOfferFilters]);

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
              dateRange={interviewDateRange}
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
            data={jobOfferData as any}
            dateRange={jobOfferDateRange}
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
