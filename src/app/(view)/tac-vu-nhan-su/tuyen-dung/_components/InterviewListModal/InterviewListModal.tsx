"use client";

import { useAntdMessage } from "@/hooks/AntdMessageProvider";
import { Button, Card, Modal, Tag } from "antd";
import React, { useMemo } from "react";
import { FaCalendarAlt, FaUser } from "react-icons/fa";
import {
  generateInvitationHTML,
  InterviewDetails,
} from "../InterviewScheduleModal/invitationTemplateHTML";
import "./InterviewListModal.scss";

interface InterviewItem {
  id: string;
  date: string; // DD/MM/YYYY
  startTime: string; // HH:mm
  endTime: string; // HH:mm
  status: "INTERVIEW_SCHEDULED" | "CONFIRMED" | "CANCELLED" | "PENDING";
  interviewer: string;
  interviewerEmail?: string;
  location?: string;
  meetingLink?: string;
  notes?: string;
}

interface Props {
  open: boolean;
  onClose: () => void;
  candidateId?: string;
  candidateName?: string;
}

const statusColorMap: Record<string, string> = {
  INTERVIEW_SCHEDULED: "#43A047",
  CONFIRMED: "#1976D2",
  CANCELLED: "#E53935",
  PENDING: "#FB8C00",
};

const InterviewListModal: React.FC<Props> = ({
  open,
  onClose,
  candidateId,
  candidateName,
}) => {
  const messageApi = useAntdMessage();
  // Mock data - replace with API integration
  const interviews: InterviewItem[] = useMemo(
    () => [
      {
        id: "iv1",
        date: "12/10/2025",
        startTime: "09:30",
        endTime: "10:00",
        status: "INTERVIEW_SCHEDULED",
        interviewer: "Nguyễn Văn A - HR Manager",
        interviewerEmail: "nguyen.van.a@company.com",
        location: "Tầng 5, Tòa nhà ABC",
        meetingLink: "https://meet.google.com/xxx-xxxx-xxx",
        notes: "Chuẩn bị hồ sơ gốc",
      },
      {
        id: "iv2",
        date: "15/10/2025",
        startTime: "14:00",
        endTime: "14:30",
        status: "CONFIRMED",
        interviewer: "Trần Thị B - Technical Lead",
        interviewerEmail: "tran.thi.b@company.com",
        location: "Phòng họp 3",
        notes: "Test kỹ thuật 30 phút",
      },
    ],
    []
  );

  const resendInvitation = async (item: InterviewItem) => {
    // Build a minimal InterviewDetails shape compatible with invitation template
    const interviewDetails = {
      candidate: {
        id: candidateId || "",
        fullName: candidateName || "",
        email: "",
        phone: "",
      },
      date: item.date,
      startTime: item.startTime,
      endTime: item.endTime,
      interviewType: item.meetingLink ? "online" : "offline",
      location: item.location
        ? {
            id: "loc1",
            name: item.location,
            address: item.location,
            mapUrl: "",
          }
        : undefined,
      meetingLink: item.meetingLink,
      interviewer: item.interviewer,
      interviewerEmail: item.interviewerEmail || "",
      notes: item.notes || "",
      fullDateTime: `${item.date} từ ${item.startTime} đến ${item.endTime}`,
    } as InterviewDetails;

    try {
      const html2canvas = (await import("html2canvas")).default;

      const tempDiv = document.createElement("div");
      tempDiv.style.width = "800px";
      tempDiv.style.background = "white";
      tempDiv.style.padding = "40px";
      tempDiv.style.fontFamily = "Arial, sans-serif";
      tempDiv.style.position = "absolute";
      tempDiv.style.left = "-9999px";
      document.body.appendChild(tempDiv);

      tempDiv.innerHTML = generateInvitationHTML(interviewDetails);

      const canvas = await html2canvas(tempDiv, {
        useCORS: true,
        allowTaint: true,
      });
      canvas.toBlob((blob) => {
        if (blob) {
          const url = URL.createObjectURL(blob);
          const link = document.createElement("a");
          link.href = url;
          link.download = `Thu_moi_phong_van_${
            candidateName || "ung_vien"
          }.png`;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          URL.revokeObjectURL(url);
          messageApi.success("Đã gửi / tải lại thư mời phỏng vấn!");
        }
      }, "image/png");

      document.body.removeChild(tempDiv);
    } catch (err) {
      console.error(err);
      messageApi.error("Gửi lại thư mời thất bại");
    }
  };

  return (
    <Modal
      title={
        <div className="modal-title">
          <FaCalendarAlt /> Lịch hẹn phỏng vấn
        </div>
      }
      open={open}
      onCancel={onClose}
      footer={null}
      width={900}
      className="interview-list-modal"
    >
      <div className="interview-list">
        {interviews.map((it) => (
          <Card key={it.id} className="interview-card">
            <div className="card-row">
              <div className="card-main">
                <div className="card-title">
                  {it.date} • {it.startTime} - {it.endTime}
                </div>
                <div className="card-sub">{it.interviewer}</div>
                {it.location && (
                  <div className="card-sub small">
                    <FaUser /> {it.location}
                  </div>
                )}
              </div>
              <div className="card-actions">
                <Tag
                  style={{
                    background: statusColorMap[it.status],
                    color: "#fff",
                  }}
                >
                  {it.status}
                </Tag>
                <Button type="primary" onClick={() => resendInvitation(it)}>
                  Gửi lại thư mời
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </Modal>
  );
};

export default InterviewListModal;
