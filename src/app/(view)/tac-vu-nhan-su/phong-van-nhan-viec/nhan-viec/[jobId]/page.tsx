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

export default function JobDetailPage() {
  const params = useParams();
  const router = useRouter();
  const jobId = params.jobId as string;

  const [loading, setLoading] = useState(true);
  const [jobAppointment, setJobAppointment] = useState<AppointmentItem | null>(
    null
  );

  const fetchJobDetail = async () => {
    setLoading(true);
    try {
      // TODO: Replace with actual API call
      // const response = await JobServices.getJobById(jobId);
      // setJobAppointment(response.data);

      // Mock data for now
      await new Promise((resolve) => setTimeout(resolve, 500));
      setJobAppointment({
        id: jobId,
        candidateId: "1",
        candidateName: "Nguyễn Văn A",
        candidateEmail: "nguyenvana@example.com",
        candidatePhone: "0912345678",
        jobId: jobId,
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
        interviewDate: "2025-01-20",
        startTime: "14:00",
        endTime: "16:00",
        interviewType: "offline",
        location: "Tòa nhà ABC, Quận 1",
        interviewer: "Lê Thị C",
        interviewerEmail: "lethic@company.com",
        interviewerPhone: "0901234567",
        status: "PENDING",
        notes:
          "Vị trí tuyển dụng quan trọng, cần đánh giá kỹ năng kỹ thuật và soft skills",
      } as unknown as AppointmentItem);
    } catch (error: any) {
      showError(
        error.response?.data?.message || "Lỗi khi tải thông tin công việc"
      );
      router.push("/tac-vu-nhan-su/phong-van-nhan-viec");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobDetail();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [jobId]);

  const handleBack = () => {
    router.back();
  };

  if (loading) {
    return (
      <div className="job-detail-loading">
        <Spin size="large" tip="Đang tải thông tin..." />
      </div>
    );
  }

  if (!jobAppointment) {
    return null;
  }

  return (
    <LayoutContent
      layoutType={1}
      content1={
        <div className="job-detail-page">
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
                <h1 className="page-title">{jobAppointment.jobTitle}</h1>
                <div className="header-meta">
                  <span className="position-name">
                    {jobAppointment.department}
                  </span>
                  <Tag
                    color={statusConfig[jobAppointment.status].color}
                    className="status-tag"
                  >
                    {statusConfig[jobAppointment.status].text}
                  </Tag>
                </div>
              </div>
              <p className="page-subtitle">Chi tiết công việc nhân viên</p>
            </div>
          </div>

          <div className="page-content">
            <AppointmentDetailTabs
              interview={[] as any}
              onRefresh={fetchJobDetail}
              defaultTab="candidates"
            />
          </div>
        </div>
      }
    />
  );
}
