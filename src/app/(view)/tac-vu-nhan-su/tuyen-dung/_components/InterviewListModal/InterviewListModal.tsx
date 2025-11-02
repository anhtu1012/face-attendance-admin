"use client";

import { Button, Card, Modal, Tag } from "antd";
import React from "react";
import {
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaUserTie,
  FaLaptop,
  FaStickyNote,
  FaBriefcase,
} from "react-icons/fa";
import "./InterviewListModal.scss";
import TuyenDungServices from "@/services/tac-vu-nhan-su/tuyen-dung/tuyen-dung.service";
import { AppointmentListWithInterview } from "@/dtos/tac-vu-nhan-su/phong-van-nhan-viec/appointment.dto";
import dayjs from "dayjs";
interface Props {
  open: boolean;
  onClose: () => void;
  intervieweeId?: string;
  candidateName?: string;
}

const statusColorMap: Record<string, string> = {
  ACCEPTED: "#43A047",
  CONFIRMED: "#1976D2",
  CANCELLED: "#E53935",
  PENDING: "#FB8C00",
};

const InterviewListModal: React.FC<Props> = ({
  open,
  onClose,
  intervieweeId,
  candidateName,
}) => {
  // const messageApi = useAntdMessage();
  console.log({ intervieweeId, candidateName });
  const [interviews, setInterviews] = React.useState<
    AppointmentListWithInterview[]
  >([]);

  React.useEffect(() => {
    if (!open || !intervieweeId) return;
    const fetchInterviews = async () => {
      try {
        const response = await TuyenDungServices.getDanhSachPhongVanWithParam(
          [],
          undefined,
          {
            intervieweeId,
          }
        );
        setInterviews(response.data);
      } catch (error) {
        console.log("error", error);
      }
    };
    fetchInterviews();
  }, [open, intervieweeId]);

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
            <div className="card-header">
              <div className="card-title-row">
                <div className="card-title">
                  <FaBriefcase size={18} style={{ marginRight: 8 }} />
                  {it.jobInfor?.jobTitle || "Không có tiêu đề công việc"}
                </div>
                <Tag
                  style={{
                    background: statusColorMap[it.status],
                    color: "#fff",
                  }}
                >
                  {it.status === "PENDING"
                    ? "Chờ xác nhận"
                    : it.status === "ACCEPTED"
                    ? "Đã chấp nhận"
                    : it.status === "COMPLETED"
                    ? "Đã hoàn thành"
                    : it.status === "CANCELLED"
                    ? "Đã hủy"
                    : it.status}
                </Tag>
              </div>
              <div className="card-datetime">
                <FaCalendarAlt size={14} />
                {dayjs(it.interviewDate).format("DD/MM/YYYY")} •{" "}
                {dayjs(it.startTime).format("HH:mm")} -{" "}
                {dayjs(it.endTime).format("HH:mm")}
              </div>
            </div>

            <div className="card-body">
              {it.listInterviewers && it.listInterviewers.length > 0 && (
                <div className="card-info-row">
                  <span className="info-label">
                    <FaUserTie /> Người phỏng vấn:
                  </span>
                  <div className="interviewers-list">
                    {it.listInterviewers.map((interviewer, idx) => (
                      <div key={idx} className="interviewer-item">
                        <span className="interviewer-name">
                          {interviewer.interviewerName}
                        </span>
                        {interviewer.interviewerEmail && (
                          <span className="interviewer-email">
                            ({interviewer.interviewerEmail})
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {it.typeAppointment && (
                <div className="card-info-row">
                  <span className="info-label">
                    <FaLaptop /> Hình thức:
                  </span>
                  <Tag
                    color={it.typeAppointment === "Online" ? "blue" : "green"}
                  >
                    {it.typeAppointment === "online"
                      ? "Trực tuyến"
                      : "Trực tiếp"}
                  </Tag>
                </div>
              )}
              {it.address && (
                <div className="card-info-row">
                  <span className="info-label">
                    <FaMapMarkerAlt />{" "}
                    {it.typeAppointment === "online"
                      ? "Link cuộc họp:"
                      : "Địa điểm:"}
                  </span>
                  <span className="info-value">
                    {it.typeAppointment === "online"
                      ? it.meetingLink
                      : it.address}
                  </span>
                </div>
              )}

              {it.notes && (
                <div className="card-info-row">
                  <span className="info-label">
                    <FaStickyNote /> Ghi chú:
                  </span>
                  <span className="info-value">{it.notes}</span>
                </div>
              )}
            </div>

            <div className="card-footer">
              <Button type="primary" onClick={() => {}}>
                Gửi lại thư mời
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </Modal>
  );
};

export default InterviewListModal;
