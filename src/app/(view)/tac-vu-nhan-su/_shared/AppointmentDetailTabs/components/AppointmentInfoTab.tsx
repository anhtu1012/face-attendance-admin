"use client";

import { AppointmentItem } from "@/dtos/tac-vu-nhan-su/phong-van-nhan-viec/interview.dto";
import { Button, Card, Col, Descriptions, Row, Space, Tag } from "antd";
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
} from "react-icons/fa";
import "./AppointmentInfoTab.scss";

// Extended interview type to include job-related fields
type AppointmentWithJobDetails = AppointmentItem & {
  requireExperience?: string;
  fromSalary?: string;
  toSalary?: string;
  requireSkill?: string[];
};

interface AppointmentInfoTabProps {
  interview: AppointmentItem;
  onRefresh: () => void;
}

export default function AppointmentInfoTab({
  interview,
}: AppointmentInfoTabProps) {
  const isOnline = interview.interviewType === "online";
  const interviewWithJobDetails = interview as AppointmentWithJobDetails;

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
                  {dayjs(interview.interviewDate).format("DD/MM/YYYY (dddd)")}
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
                  {interview.startTime} - {interview.endTime}
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

              {!isOnline && interview.location && (
                <Descriptions.Item
                  label={
                    <span className="label-text">
                      <FaMapMarkerAlt className="gradient-icon" /> Địa điểm
                    </span>
                  }
                >
                  {interview.location}
                </Descriptions.Item>
              )}
            </Descriptions>
          </Card>
        </Col>
        <Col span={12}>
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
              <Descriptions.Item label="Kinh nghiệm yêu cầu">
                <Tag color="orange">
                  {interviewWithJobDetails.requireExperience || "Không yêu cầu"}
                </Tag>
              </Descriptions.Item>

              <Descriptions.Item label="Mức lương">
                <Tag color="green">
                  {interviewWithJobDetails.fromSalary &&
                  interviewWithJobDetails.toSalary
                    ? `${interviewWithJobDetails.fromSalary} - ${interviewWithJobDetails.toSalary}`
                    : "Thương lượng"}
                </Tag>
              </Descriptions.Item>

              <Descriptions.Item label="Kỹ năng yêu cầu" span={2}>
                <div>
                  {interviewWithJobDetails.requireSkill &&
                  interviewWithJobDetails.requireSkill.length > 0 ? (
                    interviewWithJobDetails.requireSkill.map(
                      (skill: string, index: number) => (
                        <Tag
                          key={index}
                          color="blue"
                          style={{ marginBottom: 4 }}
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
    </div>
  );
}
