/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  ApartmentOutlined,
  ArrowLeftOutlined,
  DeleteOutlined,
  EnvironmentOutlined,
  UserOutlined
} from "@ant-design/icons";
import { Button, Card, Col, List, Row, Tag } from "antd";
import dayjs from "dayjs";
import type { JSX } from "react";
import React from "react";
import { getDayNameInVietnamese } from "../../utils/dateLocalization";

interface DetailViewProps {
  currentSchedule: any;
  employeeList: any[];
  scheduleData: any[];
  setDetailView: (show: boolean) => void;
  handleEditSchedule: (schedule: any) => void;
  handleDeleteSchedule: (id: string) => void;
  handleViewSchedule: (schedule: any) => void;
  getAttendanceTag: (status: string) => JSX.Element;
  getStatusTag: (status: string) => JSX.Element;
  calculateLateMinutes: (schedule: any) => number;
  calculateEarlyMinutes: (schedule: any) => number;
}

const DetailView: React.FC<DetailViewProps> = ({
  currentSchedule,
  employeeList,
  scheduleData,
  setDetailView,
  // handleEditSchedule,
  handleDeleteSchedule,
  handleViewSchedule,
  getAttendanceTag,
  getStatusTag,
  calculateLateMinutes,
  calculateEarlyMinutes,
}) => {
  if (!currentSchedule) return null;

  const employee = employeeList.find(
    (e) => e.userCode === currentSchedule.userCode
  );

  // Find other schedules for the same employee on the same day
  const otherSchedules = scheduleData.filter(
    (s) =>
      s.userCode === currentSchedule.userCode &&
      s.date === currentSchedule.date &&
      s.id !== currentSchedule.id
  );

  // Calculate late and early minutes
  const lateMinutes = calculateLateMinutes(currentSchedule);
  const earlyMinutes = calculateEarlyMinutes(currentSchedule);

  return (
    <div className="schedule-detail-view">
      <div className="detail-header">
        <Button
          icon={<ArrowLeftOutlined />}
          onClick={() => setDetailView(false)}
          style={{ marginRight: 16 }}
        >
          Quay lại
        </Button>
        <h2>Chi tiết lịch làm việc</h2>
        <div className="header-actions">
          {/* <Button
            icon={<EditOutlined />}
            onClick={() => {
              setDetailView(false);
              handleEditSchedule(currentSchedule);
            }}
            style={{ marginRight: 8 }}
          >
            Chỉnh sửa
          </Button> */}
          <Button
            danger
            icon={<DeleteOutlined />}
            onClick={() => {
              handleDeleteSchedule(currentSchedule.id);
              setDetailView(false);
            }}
          >
            Xóa
          </Button>
        </div>
      </div>

      <div className="detail-content">
        <Row gutter={[24, 24]}>
          <Col xs={24} md={8}>
            <Card title="Thông tin nhân viên" bordered={false}>
              <div className="employee-detail">
                {employee?.avatar && (
                  <img
                    src={employee.avatar}
                    className="employee-avatar-large"
                    alt={employee.name}
                  />
                )}
                <div className="employee-info">
                  <h3>{currentSchedule.fullName || "N/A"}</h3>
                  <p>
                    <UserOutlined />{" "}
                    {employee?.position ||
                      currentSchedule.positionName ||
                      "N/A"}
                  </p>
                  {currentSchedule.managerFullName && (
                    <p>
                      <UserOutlined /> Quản lý:{" "}
                      {currentSchedule.managerFullName}
                    </p>
                  )}
                </div>
              </div>
            </Card>

            <Card
              title="Chi nhánh làm việc"
              bordered={false}
              style={{ marginTop: 16 }}
            >
              <div className="branch-detail">
                <h4>
                  <ApartmentOutlined /> {currentSchedule.branchName || "N/A"}
                </h4>
                <p>
                  <EnvironmentOutlined /> {currentSchedule.addressLine || "N/A"}
                </p>
              </div>
            </Card>

            {otherSchedules.length > 0 && (
              <Card
                title="Ca làm việc khác trong ngày"
                bordered={false}
                style={{ marginTop: 16 }}
              >
                <List
                  itemLayout="horizontal"
                  dataSource={otherSchedules}
                  renderItem={(schedule) => (
                    <List.Item
                      actions={[
                        <Button
                          key="view"
                          type="link"
                          onClick={() => handleViewSchedule(schedule)}
                        >
                          Xem
                        </Button>,
                      ]}
                    >
                      <List.Item.Meta
                        title={schedule.shift}
                        description={
                          <div>
                            <div>
                              {schedule.startTime} - {schedule.endTime}
                            </div>
                            <div>{schedule ? schedule.branchName : "N/A"}</div>
                          </div>
                        }
                      />
                    </List.Item>
                  )}
                />
              </Card>
            )}
          </Col>

          <Col xs={24} md={16}>
            <Card title="Thông tin ca làm việc" bordered={false}>
              <Row gutter={[16, 16]}>
                <Col span={12}>
                  <div className="detail-item">
                    <div className="item-label">Ngày làm việc</div>
                    <div className="item-value">
                      {getDayNameInVietnamese(dayjs(currentSchedule.date))},{" "}
                      {dayjs(currentSchedule.date).format("DD/MM/YYYY")}
                    </div>
                  </div>
                </Col>
                <Col span={12}>
                  <div className="detail-item">
                    <div className="item-label">Ca làm việc</div>
                    <div className="item-value">{currentSchedule.shift}</div>
                  </div>
                </Col>
                <Col span={12}>
                  <div className="detail-item">
                    <div className="item-label">Giờ bắt đầu</div>
                    <div className="item-value">
                      {currentSchedule.startTime}
                    </div>
                  </div>
                </Col>
                <Col span={12}>
                  <div className="detail-item">
                    <div className="item-label">Giờ kết thúc</div>
                    <div className="item-value">{currentSchedule.endTime}</div>
                  </div>
                </Col>
                <Col span={24}>
                  <div className="detail-item">
                    <div className="item-label">Trạng thái lịch</div>
                    <div className="item-value">
                      {getStatusTag(currentSchedule.status)}
                    </div>
                  </div>
                </Col>
              </Row>
            </Card>

            <Card
              title="Thông tin chấm công"
              bordered={false}
              style={{ marginTop: 16 }}
            >
              <div className="attendance-summary">
                <div className="attendance-status-large">
                  {currentSchedule.attendanceStatus ? (
                    getAttendanceTag(currentSchedule.attendanceStatus)
                  ) : (
                    <Tag>Chưa có dữ liệu</Tag>
                  )}
                </div>

                <Row gutter={24} style={{ marginTop: 16 }}>
                  <Col span={12}>
                    <Card className="time-card checkin">
                      <div className="time-label">Giờ Check-in</div>
                      <div className="time-value">
                        {currentSchedule.checkinTime || "——"}
                      </div>
                      {currentSchedule.checkinTime &&
                        (lateMinutes > 0 ? (
                          <div className="time-diff late">
                            Trễ {lateMinutes} phút
                          </div>
                        ) : (
                          <div className="time-diff right">Đúng giờ</div>
                        ))}
                    </Card>
                  </Col>

                  <Col span={12}>
                    <Card className="time-card checkout">
                      <div className="time-label">Giờ Check-out</div>
                      <div className="time-value">
                        {currentSchedule.checkoutTime || "——"}
                      </div>
                      {currentSchedule.checkoutTime &&
                        (earlyMinutes > 0 ? (
                          <div className="time-diff early">
                            Về sớm {earlyMinutes} phút
                          </div>
                        ) : (
                          <div className="time-diff right">Đúng giờ</div>
                        ))}
                    </Card>
                  </Col>
                </Row>

                {currentSchedule.note && (
                  <div className="attendance-note">
                    <div className="note-label">Ghi chú:</div>
                    <div className="note-content">{currentSchedule.note}</div>
                  </div>
                )}
              </div>
            </Card>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default DetailView;
