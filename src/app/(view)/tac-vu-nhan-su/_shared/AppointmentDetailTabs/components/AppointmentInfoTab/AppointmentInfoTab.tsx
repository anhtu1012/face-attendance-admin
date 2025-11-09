"use client";

import {
  Button,
  Card,
  Col,
  Descriptions,
  Modal,
  Row,
  Space,
  Tag,
  message,
} from "antd";
import dayjs from "dayjs";
import {
  FaBriefcase,
  FaCalendarAlt,
  FaClipboardList,
  FaClock,
  FaLink,
  FaMapMarkerAlt,
  FaStickyNote,
  FaVideo,
  FaUser,
  FaUsers,
  FaChartLine,
} from "react-icons/fa";
import "./AppointmentInfoTab.scss";
import { AppointmentListWithInterview } from "@/dtos/tac-vu-nhan-su/phong-van-nhan-viec/appointment.dto";
import { useSelector } from "react-redux";
import { selectAuthLogin } from "@/lib/store/slices/loginSlice";
import Cbutton from "@/components/basicUI/Cbutton";
import { RoleAdmin } from "@/types/enum";
import InfoInterviewLeader from "@/app/(view)/tac-vu-nhan-su/_components/InfoInterviewLeader/InfoInterviewLeader";
import { useState } from "react";
import QuanLyPhongVanServices from "@/services/tac-vu-nhan-su/quan-ly-phong-van/quan-ly-phong-van.service";

interface AppointmentInfoTabProps {
  interview: AppointmentListWithInterview;
  onRefresh: () => void | Promise<void>;
}

interface InterviewerSelection {
  label: string;
  email: string;
  value: string;
}

export default function AppointmentInfoTab({
  interview,
  onRefresh,
}: AppointmentInfoTabProps) {
  const isOnline = interview.typeAppointment === "online";
  const { userProfile } = useSelector(selectAuthLogin);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedInterviewers, setSelectedInterviewers] = useState<
    InterviewerSelection[]
  >([]);

  const probationOptions = [
    { value: "1_MONTH", label: "1 tháng" },
    { value: "2_MONTHS", label: "2 tháng" },
    { value: "3_MONTHS", label: "3 tháng" },
    { value: "6_MONTHS", label: "6 tháng" },
  ];

  const trialLabel =
    probationOptions.find(
      (opt) => opt.value === interview.jobInfor?.trialPeriod
    )?.label || "-";

  const handleChange = (interview: AppointmentListWithInterview) => {
    // Logic to handle the change action
    console.log("Change action for interview:", interview);
    setIsModalOpen(true);
  };

  const handleModalOk = async () => {
    const payload = selectedInterviewers.map((i) => i.value);
    try {
      await QuanLyPhongVanServices.addInterviewer(interview.appointmentId, {
        listInterviewerId: payload,
      });
      setIsModalOpen(false);
      try {
        await Promise.resolve(onRefresh());
      } catch (refreshErr) {
        console.error("Refresh failed:", refreshErr);
      }
      message.success("Cập nhật người phỏng vấn thành công");
    } catch (error) {
      console.error(error);
      message.error("Cập nhật người phỏng vấn thất bại");
    }
  };

  const handleModalCancel = () => {
    setIsModalOpen(false);
  };

  const handleSelectedChange = (selectedUsers: InterviewerSelection[]) => {
    setSelectedInterviewers(selectedUsers);
  };

  return (
    <div className="interview-info-tab">
      <Row gutter={[5, 5]}>
        <Col span={24}>
          {/* Schedule Card */}
          <Card
            title={
              <span>
                <FaCalendarAlt className="gradient-icon" /> Thời gian & Địa điểm
              </span>
            }
            className="info-card"
          >
            <Descriptions column={2} bordered>
              <Descriptions.Item
                label={
                  <span className="label-text">
                    <FaCalendarAlt className="gradient-icon" /> Ngày
                  </span>
                }
                span={1.3}
              >
                <strong>
                  {interview.interviewDate
                    ? dayjs(interview.interviewDate).format("DD/MM/YYYY (dddd)")
                    : "-"}
                </strong>
              </Descriptions.Item>

              <Descriptions.Item
                label={
                  <span className="label-text">
                    <FaClock className="gradient-icon" /> Thời gian
                  </span>
                }
                span={0.7}
              >
                <strong>
                  {dayjs(interview.startTime).format("HH:mm") || "-"} -{" "}
                  {dayjs(interview.endTime).format("HH:mm") || "-"}
                </strong>
              </Descriptions.Item>

              <Descriptions.Item
                label={
                  <span className="label-text">
                    {isOnline ? (
                      <FaVideo className="gradient-icon" />
                    ) : (
                      <FaMapMarkerAlt className="gradient-icon" />
                    )}
                    Hình thức
                  </span>
                }
              >
                <Tag color={isOnline ? "green" : "blue"}>
                  {isOnline ? "Phỏng vấn trực tuyến" : "Phỏng vấn trực tiếp"}
                </Tag>
              </Descriptions.Item>

              {isOnline && interview.meetingLink && (
                <Descriptions.Item
                  label={
                    <span className="label-text">
                      <FaLink className="gradient-icon" /> Meeting
                    </span>
                  }
                >
                  <a
                    href={interview.meetingLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="meeting-link"
                  >
                    {interview.meetingLink}
                  </a>
                </Descriptions.Item>
              )}

              {!isOnline &&
                (interview.address || interview.jobInfor?.address) && (
                  <Descriptions.Item
                    label={
                      <span className="label-text">
                        <FaMapMarkerAlt className="gradient-icon" /> Địa điểm
                      </span>
                    }
                  >
                    {interview.address || interview.jobInfor?.address}
                  </Descriptions.Item>
                )}
            </Descriptions>
          </Card>
        </Col>
        <Col span={24}>
          {/* Job Info Card */}
          <Card
            title={
              <span>
                <FaBriefcase className="gradient-icon" /> Thông tin công việc
              </span>
            }
            className="info-card"
          >
            <Descriptions column={2} bordered>
              <Descriptions.Item label="Mã công việc">
                <strong>{interview.jobInfor?.jobCode || "-"}</strong>
              </Descriptions.Item>

              <Descriptions.Item label="Vị trí">
                <strong>
                  {interview.jobInfor?.positionName ||
                    interview.jobInfor?.jobTitle ||
                    "-"}
                </strong>
              </Descriptions.Item>

              <Descriptions.Item label="Trạng thái">
                <Tag
                  color={
                    interview.jobInfor?.status === "OPEN" ? "green" : "default"
                  }
                >
                  {interview.jobInfor?.status || "-"}
                </Tag>
              </Descriptions.Item>

              <Descriptions.Item label="Kinh nghiệm yêu cầu">
                <Tag color="orange">
                  {interview.jobInfor?.requireExperience || "Không yêu cầu"}
                </Tag>
              </Descriptions.Item>

              <Descriptions.Item label="Mức lương (triệu VNĐ)">
                <Tag color="green">
                  {interview.jobInfor?.fromSalary &&
                  interview.jobInfor?.toSalary
                    ? `${interview.jobInfor.fromSalary} - ${interview.jobInfor.toSalary}`
                    : "Thương lượng"}
                </Tag>
              </Descriptions.Item>

              <Descriptions.Item label="Thời gian thử việc">
                <div>{trialLabel}</div>
              </Descriptions.Item>

              <Descriptions.Item label="Hạn nộp hồ sơ">
                <div>
                  {interview.jobInfor?.expirationDate
                    ? dayjs(interview.jobInfor.expirationDate).format(
                        "DD/MM/YYYY"
                      )
                    : "-"}
                </div>
              </Descriptions.Item>

              <Descriptions.Item label="Địa chỉ làm việc">
                <div>
                  {interview.jobInfor?.address || interview.address || "-"}
                </div>
              </Descriptions.Item>

              <Descriptions.Item label="Mô tả công việc" span={2}>
                <div
                  dangerouslySetInnerHTML={{
                    __html: interview.jobInfor?.jobDescription || "-",
                  }}
                />
              </Descriptions.Item>

              <Descriptions.Item label="Tổng quan" span={2}>
                <div
                  dangerouslySetInnerHTML={{
                    __html: interview.jobInfor?.jobOverview || "-",
                  }}
                />
              </Descriptions.Item>

              <Descriptions.Item label="Nhiệm vụ chính" span={2}>
                <div
                  dangerouslySetInnerHTML={{
                    __html: interview.jobInfor?.jobResponsibility || "-",
                  }}
                />
              </Descriptions.Item>

              <Descriptions.Item label="Phúc lợi" span={2}>
                <div
                  dangerouslySetInnerHTML={{
                    __html: interview.jobInfor?.jobBenefit || "-",
                  }}
                />
              </Descriptions.Item>

              <Descriptions.Item label="Kỹ năng yêu cầu" span={2}>
                <div>
                  {interview.jobInfor?.listSkills &&
                  interview.jobInfor.listSkills.length > 0 ? (
                    interview.jobInfor.listSkills.map(
                      (skill: string, index: number) => (
                        <Tag
                          key={index}
                          color="blue"
                          style={{ marginBottom: 4, marginRight: 4 }}
                        >
                          {skill}
                        </Tag>
                      )
                    )
                  ) : (
                    <Tag color="default">Chưa có thông tin</Tag>
                  )}
                </div>
              </Descriptions.Item>
            </Descriptions>
          </Card>
        </Col>

        {/* Recruiter Info Card */}
        {interview.jobInfor?.recruiter && (
          <Col span={12}>
            <Card
              title={
                <span>
                  <FaUser className="gradient-icon" /> Nhà tuyển dụng
                </span>
              }
              className="info-card"
            >
              <Descriptions column={1} bordered>
                <Descriptions.Item label="Họ tên">
                  <strong>
                    {interview.jobInfor.recruiter.fullName || "-"}
                  </strong>
                </Descriptions.Item>
                <Descriptions.Item label="Vị trí">
                  {interview.jobInfor.recruiter.recruiterPositionName || "-"}
                </Descriptions.Item>
                <Descriptions.Item label="Email">
                  {interview.jobInfor.recruiter.email || "-"}
                </Descriptions.Item>
                <Descriptions.Item label="Số điện thoại">
                  {interview.jobInfor.recruiter.phone || "-"}
                </Descriptions.Item>
              </Descriptions>
            </Card>
          </Col>
        )}

        {/* Statistics Card */}
        {interview.jobInfor?.statistics && (
          <Col span={12}>
            <Card
              title={
                <span>
                  <FaChartLine className="gradient-icon" /> Thống kê tuyển dụng
                </span>
              }
              className="info-card"
            >
              <Descriptions column={1} bordered>
                <Descriptions.Item label="Số ứng viên">
                  <Tag color="blue">
                    {interview.jobInfor.statistics.applicants || "0"}
                  </Tag>
                </Descriptions.Item>
                <Descriptions.Item label="Đã sơ tuyển">
                  <Tag color="cyan">
                    {interview.jobInfor.statistics.shortlisted || "0"}
                  </Tag>
                </Descriptions.Item>
                <Descriptions.Item label="Tỷ lệ phù hợp">
                  <Tag color="green">
                    {interview.jobInfor.statistics.properRatio || "0"}%
                  </Tag>
                </Descriptions.Item>
              </Descriptions>
            </Card>
          </Col>
        )}

        {/* Interviewers List Card */}
        {interview.listInterviewers &&
          interview.listInterviewers.length > 0 && (
            <Col span={24}>
              <Card
                title={
                  <span>
                    <FaUsers className="gradient-icon" /> Danh sách người phỏng
                    vấn
                  </span>
                }
                className="info-card"
              >
                <Descriptions column={1} bordered>
                  {interview.listInterviewers.map((interviewer, index) => (
                    <Descriptions.Item
                      key={index}
                      label={`Người phỏng vấn ${index + 1}`}
                    >
                      <Space
                        direction="vertical"
                        size="small"
                        style={{ width: "100%" }}
                      >
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                          }}
                        >
                          <div>
                            <div>
                              <strong>{interviewer.interviewerName}</strong>
                              <Tag
                                color={
                                  interviewer.status === "ACCEPTED"
                                    ? "green"
                                    : interviewer.status === "REJECTED"
                                    ? "red"
                                    : "gold"
                                }
                                style={{ marginLeft: 8 }}
                              >
                                {interviewer.status === "ACCEPTED"
                                  ? "Đã chấp nhận"
                                  : interviewer.status === "REJECTED"
                                  ? "Từ chối"
                                  : "Chờ xác nhận"}
                              </Tag>
                            </div>
                            {interviewer.interviewerEmail && (
                              <div>Email: {interviewer.interviewerEmail}</div>
                            )}
                            {interviewer.interviewerPhone && (
                              <div>SĐT: {interviewer.interviewerPhone}</div>
                            )}
                          </div>
                          <div>
                            {userProfile.roleId === RoleAdmin.HR &&
                              interviewer.status === "REJECTED" && (
                                <Cbutton
                                  onClick={() => handleChange(interview)}
                                >
                                  Thay Đổi
                                </Cbutton>
                              )}
                          </div>
                        </div>
                      </Space>
                    </Descriptions.Item>
                  ))}
                </Descriptions>
              </Card>
            </Col>
          )}
      </Row>

      {/* Notes Card */}
      {interview.notes && (
        <Card
          title={
            <span>
              <FaStickyNote className="gradient-icon" /> Ghi chú
            </span>
          }
          className="info-card notes-card"
        >
          <p className="notes-content">{interview.notes}</p>
        </Card>
      )}

      {/* Result Card */}
      {interview.result && (
        <Card
          title={
            <span>
              <FaClipboardList className="gradient-icon" /> Kết quả phỏng vấn
            </span>
          }
          className="info-card result-card"
        >
          <p className="result-content">{interview.result}</p>
        </Card>
      )}

      {/* Actions */}
      <div className="actions-section">
        <Space>
          <Button type="primary">Cập nhật thông tin</Button>
          <Button>Gửi email nhắc nhở</Button>
          <Button danger>Hủy lịch hẹn</Button>
        </Space>
      </div>

      {/* Modal for changing interviewers */}
      <Modal
        title="Chọn người phỏng vấn"
        open={isModalOpen}
        onOk={handleModalOk}
        onCancel={handleModalCancel}
        width={800}
        okText="Xác nhận"
        cancelText="Hủy"
      >
        <InfoInterviewLeader
          jobId={interview.jobInfor?.jobId}
          onSelectedChange={handleSelectedChange}
          preSelectedEmails={
            interview.listInterviewers
              ?.filter((i) => i.status !== "REJECTED")
              .map((i) => i.interviewerEmail || "") || []
          }
          maxSelectable={
            interview.interviewerCount
              ? Number(interview.interviewerCount)
              : undefined
          }
        />
      </Modal>
    </div>
  );
}
