/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import LayoutContent from "@/components/LayoutContentForder/layoutContent";
import { AppointmentItem } from "@/dtos/tac-vu-nhan-su/phong-van-nhan-viec/interview.dto";
import { showError } from "@/hooks/useNotification";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { Button, Spin, Tag } from "antd";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import "./page.scss";
import AppointmentDetailTabs from "../../../_shared/AppointmentDetailTabs";

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
  const [interview, setAppointment] = useState<AppointmentItem | null>(null);

  const fetchAppointmentDetail = async () => {
    setLoading(true);
    try {
      // TODO: Replace with actual API call
      // const response = await AppointmentServices.getAppointmentById(interviewId);
      // setAppointment(response.data);

      // Mock data for now
      await new Promise((resolve) => setTimeout(resolve, 500));
      setAppointment({
        id: interviewId,
        candidateId: "1",
        candidateName: "Nguyễn Văn A",
        candidateEmail: "nguyenvana@example.com",
        candidatePhone: "0912345678",
        jobId: "job1",
        jobTitle: "Senior Frontend Developer",
        department: "IT Department",
        jobLevel: "Senior",
        jobDescription:
          "Tham gia phát triển sản phẩm web, làm việc với React, Next.js và TypeScript. Tham gia review code, tối ưu hiệu năng và kiến trúc frontend.",
        jobResponsibility:
          "Xây dựng giao diện, tích hợp API, đảm bảo chất lượng mã nguồn, viết unit/integration tests.",
        jobBenefit:
          "Bảo hiểm, lương tháng 13, du lịch hàng năm, training kỹ thuật.",
        requireExperience: "3-5 năm",
        fromSalary: "20,000,000 VND",
        toSalary: "35,000,000 VND",
        requireSkill: ["React", "TypeScript", "Next.js", "Unit Testing"],
        interviewDate: "2025-01-15",
        startTime: "09:00",
        endTime: "11:00",
        interviewType: "online",
        meetingLink: "https://meet.google.com/abc-defg-hij",
        location: "Tòa nhà ABC, Quận 1",
        interviewer: "Trần Thị B",
        interviewerEmail: "tranthib@company.com",
        interviewerPhone: "0987654321",
        status: "PENDING",
        notes: "Ứng viên có kinh nghiệm 5 năm với React, Next.js",
      } as unknown as AppointmentItem);
    } catch (error: any) {
      showError(
        error.response?.data?.message || "Lỗi khi tải thông tin phỏng vấn"
      );
      router.push("/tac-vu-nhan-su/phong-van-nhan-viec");
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
                <h1 className="page-title">{interview.jobTitle}</h1>
                <div className="header-meta">
                  <span className="position-name">{interview.department}</span>
                  <Tag
                    color={statusConfig[interview.status].color}
                    className="status-tag"
                  >
                    {statusConfig[interview.status].text}
                  </Tag>
                </div>
              </div>
              <p className="page-subtitle">Chi tiết lịch phỏng vấn</p>
            </div>
          </div>

          <div className="page-content">
            <AppointmentDetailTabs
              interview={"" as any}
              onRefresh={fetchAppointmentDetail}
            />
          </div>
        </div>
      }
    />
  );
}
