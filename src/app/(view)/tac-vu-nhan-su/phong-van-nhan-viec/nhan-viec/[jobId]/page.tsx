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
import JobOfferServices from "@/services/tac-vu-nhan-su/phong-van-nhan-viec/job-offer.service";

const statusConfig = {
  ACTIVE: { text: "Đang hoạt động", color: "cyan" },
  COMPLETED: { text: "Hoàn thành", color: "blue" },
  CANCELLED: { text: "Đã hủy", color: "default" },
};

export default function JobOfferDetailPage() {
  const params = useParams();
  const router = useRouter();
  const jobId = params.jobId as string;

  const [loading, setLoading] = useState(true);
  const [jobOffer, setJobOffer] = useState<AppointmentListWithInterview | null>(
    null
  );

  const fetchJobOfferDetail = async () => {
    setLoading(true);
    try {
      const response = await JobOfferServices.getJobOffers([], undefined, {
        receiveJobId: jobId,
      });
      setJobOffer(
        response.data && response.data.length > 0 ? response.data[0] : null
      );
    } catch (error: any) {
      showError(
        error.response?.data?.message || "Lỗi khi tải thông tin nhận việc"
      );
      router.push("/tac-vu-nhan-su/phong-van-nhan-viec");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobOfferDetail();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [jobId]);

  const handleBack = () => {
    router.back();
  };

  if (loading) {
    return (
      <div className="job-offer-detail-loading">
        <Spin size="large" tip="Đang tải thông tin..." />
      </div>
    );
  }

  if (!jobOffer) {
    return null;
  }

  return (
    <LayoutContent
      layoutType={1}
      content1={
        <div className="job-offer-detail-page">
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
                <h1 className="page-title">{jobOffer?.jobInfor?.jobTitle}</h1>
                <div className="header-meta">
                  <Tag
                    color={
                      statusConfig[jobOffer.status as keyof typeof statusConfig]
                        .color
                    }
                    className="status-tag"
                  >
                    {
                      statusConfig[jobOffer.status as keyof typeof statusConfig]
                        .text
                    }
                  </Tag>
                </div>
              </div>
              <p className="page-subtitle">Chi tiết lịch nhận việc</p>
            </div>
          </div>

          <div className="page-content">
            <AppointmentDetailTabs
              interview={jobOffer}
              onRefresh={fetchJobOfferDetail}
              type="jobOffer"
            />
          </div>
        </div>
      }
    />
  );
}
