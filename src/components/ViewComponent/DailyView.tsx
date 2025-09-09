/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import type { JSX } from "react";
import Ctable from "@/components/basicUI/Ctable";
import {
  EditOutlined,
  DeleteOutlined,
  WarningOutlined,
  EyeOutlined,
  ClockCircleOutlined,
} from "@ant-design/icons";
import { Button, Tooltip, Space, Tag } from "antd";
import dayjs from "dayjs";
import { getDayNameInVietnamese } from "@/utils/dateLocalization";

interface DailyViewProps {
  currentDate: dayjs.Dayjs;
  scheduleData: any[];
  attendanceStatuses: Record<string, string>;
  loading: boolean;
  handleViewSchedule: (schedule: any) => void;
  handleEditSchedule: (schedule: any) => void;
  handleDeleteSchedule: (id: string) => void;
  getAttendanceTag: (status: string) => JSX.Element;
  getStatusTag: (status: string) => JSX.Element;
}

const DailyView: React.FC<DailyViewProps> = ({
  currentDate,
  scheduleData,
  loading,
  handleViewSchedule,
  handleEditSchedule,
  handleDeleteSchedule,
  getAttendanceTag,
  getStatusTag,
}) => {
  const calculateTimeDifference = (
    scheduledTime: string,
    actualTime: string,
    isCheckout = false
  ) => {
    if (!actualTime) return null;

    const scheduled = dayjs(
      `${currentDate.format("YYYY-MM-DD")} ${scheduledTime}`,
      "YYYY-MM-DD HH:mm"
    );
    const actual = dayjs(
      `${currentDate.format("YYYY-MM-DD")} ${actualTime}`,
      "YYYY-MM-DD HH:mm"
    );
    const diffMinutes = actual.diff(scheduled, "minute");

    if (isCheckout) {
      // For checkout, negative means early leave
      return {
        minutes: Math.abs(diffMinutes),
        isLate: false,
        isEarly: diffMinutes < -5,
        isOnTime: Math.abs(diffMinutes) <= 5,
      };
    } else {
      // For checkin, positive means late
      return {
        minutes: Math.abs(diffMinutes),
        isLate: diffMinutes > 5,
        isEarly: false,
        isOnTime: Math.abs(diffMinutes) <= 5,
      };
    }
  };

  return (
    <div className="daily-schedule-view">
      <h3>
        Lịch làm việc ngày {getDayNameInVietnamese(currentDate)},{" "}
        {currentDate.format("DD/MM/YYYY")}
      </h3>

      {scheduleData.length === 0 ? (
        <div className="empty-list">
          <div className="empty-icon">📅</div>
          <h4>Không có lịch làm việc</h4>
          <p>Chưa có ai được lên lịch làm việc trong ngày này</p>
        </div>
      ) : (
        <Ctable
          loading={loading}
          dataSource={scheduleData}
          rowKey="id"
          rowHeight={15}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) =>
              `${range[0]}-${range[1]} của ${total} ca làm việc`,
          }}
          columns={[
            {
              title: "Nhân viên",
              dataIndex: "fullName",
              key: "fullName",

              width: 200,
              // fixed: "left",
            },
            {
              title: "Chi nhánh",
              dataIndex: "branchName",
              key: "branchName",
              width: 180,
              ellipsis: true,
            },
            {
              title: "Ca làm việc",
              dataIndex: "shift",
              key: "shift",
              render: (shift, record) => (
                <div className="shift-cell">
                  <div style={{ fontWeight: 600, color: "#495057" }}>
                    {shift}
                  </div>
                  <div className="time-range">
                    <ClockCircleOutlined style={{ marginRight: 4 }} />
                    {record.startTime} - {record.endTime}
                  </div>
                </div>
              ),
              width: 150,
            },
            {
              title: "Check-in",
              dataIndex: "checkinTime",
              key: "checkinTime",
              render: (checkinTime, record) => {
                if (!checkinTime) {
                  return <span className="no-time">Chưa check-in</span>;
                }

                const timeDiff = calculateTimeDifference(
                  record.startTime,
                  checkinTime,
                  false
                );

                return (
                  <div
                    className={`time-cell ${
                      timeDiff?.isLate
                        ? "late"
                        : timeDiff?.isOnTime
                        ? "on-time"
                        : ""
                    }`}
                  >
                    <div style={{ fontWeight: 600 }}>{checkinTime}</div>
                    {timeDiff && !timeDiff.isOnTime && (
                      <div className="time-diff">
                        {timeDiff.isLate ? "Trễ" : ""} {timeDiff.minutes} phút
                      </div>
                    )}
                  </div>
                );
              },
              width: 120,
            },
            {
              title: "Check-out",
              dataIndex: "checkoutTime",
              key: "checkoutTime",
              render: (checkoutTime) => {
                if (!checkoutTime) {
                  return <span className="no-time">Chưa check-out</span>;
                }

                return <div style={{ fontWeight: 600 }}>{checkoutTime}</div>;
              },
              width: 120,
            },
            {
              title: "Trạng thái chấm công",
              dataIndex: "attendanceStatus",
              key: "attendanceStatus",
              render: (status, record) => (
                <div className="status-cell">
                  {status ? getAttendanceTag(status) : <Tag>Chưa xác định</Tag>}
                  {record.note && (
                    <Tooltip title={record.note}>
                      <Button
                        type="text"
                        size="small"
                        icon={<WarningOutlined />}
                        className="note-indicator"
                        style={{ marginLeft: 8 }}
                      />
                    </Tooltip>
                  )}
                </div>
              ),
              width: 180,
            },
            {
              title: "Trạng thái lịch",
              dataIndex: "status",
              key: "status",
              render: (status) => getStatusTag(status),
              width: 130,
            },
            {
              title: "Thao tác",
              key: "action",
              render: (_, record) => (
                <Space size="small">
                  <Tooltip title="Xem chi tiết">
                    <Button
                      type="text"
                      icon={<EyeOutlined />}
                      onClick={() => handleViewSchedule(record)}
                      style={{ color: "#667eea" }}
                    />
                  </Tooltip>
                  <Tooltip title="Chỉnh sửa">
                    <Button
                      type="text"
                      icon={<EditOutlined />}
                      onClick={() => handleEditSchedule(record)}
                      style={{ color: "#52c41a" }}
                    />
                  </Tooltip>
                  <Tooltip title="Xóa">
                    <Button
                      type="text"
                      icon={<DeleteOutlined />}
                      onClick={() => handleDeleteSchedule(record.id)}
                      style={{ color: "#ff4d4f" }}
                    />
                  </Tooltip>
                </Space>
              ),
              width: 120,
              fixed: "right",
            },
          ]}
          scroll={{ x: 1200 }}
        />
      )}

      {/* Statistics Summary */}
      {scheduleData.length > 0 && (
        <div className="statistics-panel" style={{ marginTop: 24 }}>
          <div className="statistics-header">
            <h3>Thống kê ngày {currentDate.format("DD/MM/YYYY")}</h3>
          </div>
          <div className="attendance-status-counts">
            <div className="status-badges">
              <div className="ant-statistic">
                <div className="ant-statistic-title">Tổng ca làm việc</div>
                <div className="ant-statistic-content">
                  <span className="ant-statistic-content-value">
                    {scheduleData.length}
                  </span>
                </div>
              </div>
              <div className="ant-statistic">
                <div className="ant-statistic-title">Đã check-in</div>
                <div className="ant-statistic-content">
                  <span
                    className="ant-statistic-content-value"
                    style={{ color: "#52c41a" }}
                  >
                    {scheduleData.filter((s) => s.checkinTime).length}
                  </span>
                </div>
              </div>
              <div className="ant-statistic">
                <div className="ant-statistic-title">Đã hoàn thành</div>
                <div className="ant-statistic-content">
                  <span
                    className="ant-statistic-content-value"
                    style={{ color: "#1890ff" }}
                  >
                    {
                      scheduleData.filter(
                        (s) => s.checkinTime && s.checkoutTime
                      ).length
                    }
                  </span>
                </div>
              </div>
              <div className="ant-statistic">
                <div className="ant-statistic-title">Đi trễ</div>
                <div className="ant-statistic-content">
                  <span
                    className="ant-statistic-content-value"
                    style={{ color: "#fa8c16" }}
                  >
                    {
                      scheduleData.filter((s) => {
                        if (!s.checkinTime) return false;
                        const diff = calculateTimeDifference(
                          s.startTime,
                          s.checkinTime,
                          false
                        );
                        return diff?.isLate;
                      }).length
                    }
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DailyView;
