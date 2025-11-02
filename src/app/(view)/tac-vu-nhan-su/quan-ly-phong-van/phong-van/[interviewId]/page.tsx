/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import LayoutContent from "@/components/LayoutContentForder/layoutContent";
import { showError } from "@/hooks/useNotification";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { Button, Spin, Tag } from "antd";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import AppointmentDetailTabs from "../../../_shared/AppointmentDetailTabs";
import "./page.scss";
import { AppointmentListWithInterview } from "@/dtos/tac-vu-nhan-su/phong-van-nhan-viec/appointment.dto";
import TuyenDungServices from "@/services/tac-vu-nhan-su/tuyen-dung/tuyen-dung.service";

const statusConfig = {
  PENDING: { text: "Chờ xác nhận", color: "orange" },
  ACCEPTED: { text: "Đã chấp nhận", color: "green" },
  REJECTED: { text: "Từ chối", color: "red" },
  COMPLETED: { text: "Hoàn thành", color: "blue" },
  CANCELLED: { text: "Đã hủy", color: "default" },
};

export default function AppointmentDetailPage() {
  const params = useParams();
  const router = useRouter();
  const interviewId = params.interviewId as string;

  const [loading, setLoading] = useState(true);
  const [interview, setAppointment] =
    useState<AppointmentListWithInterview | null>(null);

  const fetchAppointmentDetail = async () => {
    setLoading(true);
    try {
      const response = await TuyenDungServices.getDanhSachPhongVanWithParam(
        [],
        undefined,
        {
          appointmentId: interviewId,
        }
      );
      setAppointment(
        response.data && response.data.length > 0 ? response.data[0] : null
      );
    } catch (error: any) {
      showError(
        error.response?.data?.message || "Lỗi khi tải thông tin phỏng vấn"
      );
      router.push("/tac-vu-nhan-su/quan-ly-phong-van");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointmentDetail();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [interviewId]);

  const handleBack = () => {
    router.back();
  };

  if (loading) {
    return (
      <div className="interview-detail-loading">
        <Spin size="large" tip="Đang tải thông tin..." />
      </div>
    );
  }

  if (!interview) {
    return null;
  }

  return (
    <LayoutContent
      layoutType={1}
      content1={
        <div className="interview-detail-page">
          <div className="page-header">
            <Button
              type="text"
              icon={<ArrowLeftOutlined />}
              onClick={handleBack}
              className="back-button"
            >
              Quay lại
            </Button>
            <div className="header-info">
              <div className="header-main">
                <h1 className="page-title">{interview?.jobInfor?.jobTitle}</h1>
                <div className="header-meta">
                  <Tag
                    color={
                      statusConfig[
                        interview.status as keyof typeof statusConfig
                      ].color
                    }
                    className="status-tag"
                  >
                    {
                      statusConfig[
                        interview.status as keyof typeof statusConfig
                      ].text
                    }
                  </Tag>
                </div>
              </div>
              <p className="page-subtitle">Chi tiết lịch phỏng vấn</p>
            </div>
          </div>

          <div className="page-content">
            <AppointmentDetailTabs
              interview={interview}
              onRefresh={fetchAppointmentDetail}
            />
          </div>
        </div>
      }
    />
  );
}
