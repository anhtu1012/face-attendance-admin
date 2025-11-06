"use client";

import { Button, Card, Col, Descriptions, Row, Space, Tag } from "antd";
import dayjs from "dayjs";
import {
  FaBriefcase,
  FaCalendarAlt,
  FaUser,
  FaStickyNote,
  FaMapMarkerAlt,
  FaChartLine,
} from "react-icons/fa";
import "./JobInfoTab.scss";
import { AppointmentListWithInterview } from "@/dtos/tac-vu-nhan-su/phong-van-nhan-viec/appointment.dto";

interface JobInfoTabProps {
  jobOffer: AppointmentListWithInterview;
  onRefresh: () => void;
}

export default function JobInfoTab({
  jobOffer,
}: // onRefresh,
JobInfoTabProps) {
  const probationOptions = [
    { value: "1_MONTH", label: "1 tháng" },
    { value: "2_MONTHS", label: "2 tháng" },
    { value: "3_MONTHS", label: "3 tháng" },
    { value: "6_MONTHS", label: "6 tháng" },
  ];

  const trialLabel =
    probationOptions.find((opt) => opt.value === jobOffer.jobInfor?.trialPeriod)
      ?.label || "-";

  return (
    <div className="job-info-tab">
      <Row gutter={[5, 5]}>
        <Col span={24}>
          {/* Schedule Card */}
          <Card
            title={
              <span>
                <FaCalendarAlt className="gradient-icon" /> Thông tin nhận việc
              </span>
            }
            className="info-card"
          >
            <Descriptions column={2} bordered>
              <Descriptions.Item
                label={
                  <span className="label-text">
                    <FaCalendarAlt className="gradient-icon" /> Ngày nhận việc
                  </span>
                }
                span={2}
              >
                <strong>
                  {jobOffer.date
                    ? dayjs(jobOffer.date).format("DD/MM/YYYY (dddd)")
                    : "-"}
                </strong>
              </Descriptions.Item>

              <Descriptions.Item
                label={
                  <span className="label-text">
                    <FaMapMarkerAlt className="gradient-icon" /> Địa điểm làm
                    việc
                  </span>
                }
                span={2}
              >
                {jobOffer.jobInfor?.address || "-"}
              </Descriptions.Item>

              <Descriptions.Item label="Mã nhận việc">
                <strong>{jobOffer.receiveJobId || "-"}</strong>
              </Descriptions.Item>

              <Descriptions.Item label="Trạng thái">
                <Tag
                  color={
                    jobOffer.status === "ACTIVE"
                      ? "cyan"
                      : jobOffer.status === "COMPLETED"
                      ? "blue"
                      : "default"
                  }
                >
                  {jobOffer.status === "ACTIVE"
                    ? "Đang hoạt động"
                    : jobOffer.status === "COMPLETED"
                    ? "Hoàn thành"
                    : jobOffer.status === "CANCELLED"
                    ? "Đã hủy"
                    : jobOffer.status}
                </Tag>
              </Descriptions.Item>
            </Descriptions>
          </Card>
        </Col>

        <Col span={24}>
          {/* Position Info Card */}
          {jobOffer.positionInfor && (
            <Card
              title={
                <span>
                  <FaBriefcase className="gradient-icon" /> Thông tin vị trí
                </span>
              }
              className="info-card"
            >
              <Descriptions column={2} bordered>
                <Descriptions.Item label="Mã vị trí">
                  <strong>{jobOffer.positionInfor.code || "-"}</strong>
                </Descriptions.Item>

                <Descriptions.Item label="Tên vị trí">
                  <strong>{jobOffer.positionInfor.positionName || "-"}</strong>
                </Descriptions.Item>

                <Descriptions.Item label="Mô tả vị trí" span={2}>
                  <div>{jobOffer.positionInfor.description || "-"}</div>
                </Descriptions.Item>
              </Descriptions>
            </Card>
          )}
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
                <strong>{jobOffer.jobInfor?.jobCode || "-"}</strong>
              </Descriptions.Item>

              <Descriptions.Item label="Vị trí">
                <strong>
                  {jobOffer.jobInfor?.positionName ||
                    jobOffer.jobInfor?.jobTitle ||
                    "-"}
                </strong>
              </Descriptions.Item>

              <Descriptions.Item label="Trạng thái công việc">
                <Tag
                  color={
                    jobOffer.jobInfor?.status === "OPEN"
                      ? "green"
                      : jobOffer.jobInfor?.status === "CLOSED"
                      ? "red"
                      : "default"
                  }
                >
                  {jobOffer.jobInfor?.status === "OPEN"
                    ? "Đang mở"
                    : jobOffer.jobInfor?.status === "CLOSED"
                    ? "Đã đóng"
                    : jobOffer.jobInfor?.status || "-"}
                </Tag>
              </Descriptions.Item>

              <Descriptions.Item label="Kinh nghiệm yêu cầu">
                <Tag color="orange">
                  {jobOffer.jobInfor?.requireExperience
                    ? `${jobOffer.jobInfor.requireExperience} năm`
                    : "Không yêu cầu"}
                </Tag>
              </Descriptions.Item>

              <Descriptions.Item label="Mức lương (triệu VNĐ)">
                <Tag color="green">
                  {jobOffer.jobInfor?.fromSalary && jobOffer.jobInfor?.toSalary
                    ? `${jobOffer.jobInfor.fromSalary} - ${jobOffer.jobInfor.toSalary}`
                    : "Thương lượng"}
                </Tag>
              </Descriptions.Item>

              <Descriptions.Item label="Thời gian thử việc">
                <div>{trialLabel}</div>
              </Descriptions.Item>

              <Descriptions.Item label="Vòng tuyển dụng">
                <div>{jobOffer.jobInfor?.round || "-"}</div>
              </Descriptions.Item>

              <Descriptions.Item label="Hạn nộp hồ sơ">
                <div>
                  {jobOffer.jobInfor?.expirationDate
                    ? dayjs(jobOffer.jobInfor.expirationDate).format(
                        "DD/MM/YYYY"
                      )
                    : "-"}
                </div>
              </Descriptions.Item>

              <Descriptions.Item label="Mô tả công việc" span={2}>
                <div
                  dangerouslySetInnerHTML={{
                    __html: jobOffer.jobInfor?.jobDescription || "-",
                  }}
                />
              </Descriptions.Item>

              <Descriptions.Item label="Tổng quan" span={2}>
                <div
                  dangerouslySetInnerHTML={{
                    __html: jobOffer.jobInfor?.jobOverview || "-",
                  }}
                />
              </Descriptions.Item>

              <Descriptions.Item label="Nhiệm vụ chính" span={2}>
                <div
                  dangerouslySetInnerHTML={{
                    __html: jobOffer.jobInfor?.jobResponsibility || "-",
                  }}
                />
              </Descriptions.Item>

              <Descriptions.Item label="Phúc lợi" span={2}>
                <div
                  dangerouslySetInnerHTML={{
                    __html: jobOffer.jobInfor?.jobBenefit || "-",
                  }}
                />
              </Descriptions.Item>

              <Descriptions.Item label="Kỹ năng yêu cầu" span={2}>
                <div>
                  {jobOffer.jobInfor?.listSkills &&
                  jobOffer.jobInfor.listSkills.length > 0 ? (
                    jobOffer.jobInfor.listSkills.map(
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

        {/* HR Info Card */}
        {jobOffer.hrInfor && (
          <Col span={12}>
            <Card
              title={
                <span>
                  <FaUser className="gradient-icon" /> Thông tin HR phụ trách
                </span>
              }
              className="info-card"
            >
              <Descriptions column={1} bordered>
                <Descriptions.Item label="Họ tên">
                  <strong>{jobOffer.hrInfor.hrName || "-"}</strong>
                </Descriptions.Item>
                <Descriptions.Item label="Vị trí">
                  {jobOffer.hrInfor.recruiterPositionName || "-"}
                </Descriptions.Item>
                <Descriptions.Item label="Email">
                  {jobOffer.hrInfor.hrEmail || "-"}
                </Descriptions.Item>
                <Descriptions.Item label="Số điện thoại">
                  {jobOffer.hrInfor.hrPhone || "-"}
                </Descriptions.Item>
              </Descriptions>
            </Card>
          </Col>
        )}

        {/* Statistics Card */}
        {jobOffer.jobInfor?.statistics && (
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
                    {jobOffer.jobInfor.statistics.applicants || "0"}
                  </Tag>
                </Descriptions.Item>
                <Descriptions.Item label="Đã sơ tuyển">
                  <Tag color="cyan">
                    {jobOffer.jobInfor.statistics.shortlisted || "0"}
                  </Tag>
                </Descriptions.Item>
                <Descriptions.Item label="Tỷ lệ phù hợp">
                  <Tag color="green">
                    {jobOffer.jobInfor.statistics.properRatio || "0"}%
                  </Tag>
                </Descriptions.Item>
              </Descriptions>
            </Card>
          </Col>
        )}
      </Row>

      {/* Notes Card */}
      {jobOffer.note && (
        <Card
          title={
            <span>
              <FaStickyNote className="gradient-icon" /> Ghi chú
            </span>
          }
          className="info-card notes-card"
        >
          <p className="notes-content">{jobOffer.note}</p>
        </Card>
      )}

      {/* Actions */}
      <div className="actions-section">
        <Space>
          <Button type="primary">Cập nhật thông tin</Button>
          <Button>Gửi email thông báo</Button>
          <Button danger>Hủy lịch nhận việc</Button>
        </Space>
      </div>
    </div>
  );
}
