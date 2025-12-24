"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */
import LayoutContent from "@/components/LayoutContentForder/layoutContent";
import AppointmentWeeklyView from "@/components/ViewComponent/AppointmentWeeklyView";
import { AppointmentListWithInterview } from "@/dtos/tac-vu-nhan-su/phong-van-nhan-viec/appointment.dto";
import { showError } from "@/hooks/useNotification";
import useSocket from "@/hooks/useSocket";
import { selectAuthLogin } from "@/lib/store/slices/loginSlice";
import QuanLyPhongVanServices from "@/services/tac-vu-nhan-su/quan-ly-phong-van/quan-ly-phong-van.service";
import TuyenDungServices from "@/services/tac-vu-nhan-su/tuyen-dung/tuyen-dung.service";
import dayjs from "dayjs";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import FilterDropdown from "../_components/FilterDropdown";
import { FilterValues } from "../phong-van-nhan-viec/_types/filter.types";
import "./page.scss";
function Page() {
  // Interview states
  const [interviewData, setInterviewData] = useState<
    AppointmentListWithInterview[]
  >([]);
  const { userProfile } = useSelector(selectAuthLogin);
  const [loadingInterviews, setLoadingInterviews] = useState(false);
  const [interviewFilters, setInterviewFilters] = useState<FilterValues>({});
  const [confirm, setConfirm] = useState<string>();
  const socket = useSocket();
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
  useEffect(() => {
    if (!socket) return;

    const handleNewNotification = (data: AppointmentListWithInterview) => {
      console.log("NEW_APPOINTMENT received:", data);
      setInterviewData((prev) => [data, ...prev]);
    };
    socket.on("NEW_APPOINTMENT", handleNewNotification);

    return () => {
      socket.off("NEW_APPOINTMENT", handleNewNotification);
    };
  }, [socket]);

  const fetchInterviews = useCallback(async () => {
    if (!userProfile?.id) return;

    setLoadingInterviews(true);
    try {
      const param = {
        interviewerId: String(userProfile.id),
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
      const comf = await TuyenDungServices.getSeting();

      setConfirm(comf.data?.find((item: any) => item.id === "4")?.value);
      setInterviewData(response.data || []);
    } catch (error: any) {
      showError(
        error.response?.data?.message || "Lỗi khi tải danh sách phỏng vấn"
      );
    } finally {
      setLoadingInterviews(false);
    }
  }, [userProfile, interviewFilters]);

  // useEffect(() => {
  //   fetchInterviews();
  // }, []);

  // Filter handlers
  const handleInterviewFilter = (filters: FilterValues) => {
    setInterviewFilters(filters);
    fetchInterviews();
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

  const handleAccept = async (value: AppointmentListWithInterview) => {
    try {
      await QuanLyPhongVanServices.updateLichPhongVan({
        appointmentId: value.id,
        interviewerId: userProfile ? String(userProfile.id) : "",
        status: "ACCEPTED",
      });
      fetchInterviews();
    } catch (error) {
      console.log(error);
    }
  };

  const handleReject = async (
    appointment: AppointmentListWithInterview,
    reason: string
  ) => {
    try {
      await QuanLyPhongVanServices.updateLichPhongVan({
        appointmentId: appointment.id,
        interviewerId: userProfile ? String(userProfile.id) : "",
        status: "REJECTED",
        reason: reason,
      });
      fetchInterviews();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <LayoutContent
        layoutType={1}
        content1={
          <>
            {" "}
            <AppointmentWeeklyView
              data={interviewData}
              dateRange={dateRange}
              type="interview"
              IsHumanPV
              onItemClick={handleInterviewClick}
              onAccept={handleAccept}
              onReject={handleReject}
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
          <strong style={{ fontSize: "15px", color: "orange" }}>
            {confirm} tiếng
          </strong>{" "}
          , nếu không phản hồi hệ thống sẽ{" "}
          <strong style={{ fontSize: "15px", color: "green" }}>
            TỰ ĐỘNG XÁC NHẬN
          </strong>{" "}
        </div>
      </div>
    </div>
  );
}

export default Page;
