"use client";

import {
  ClockCircleOutlined,
  EnvironmentOutlined,
  UserOutlined,
  VideoCameraOutlined,
} from "@ant-design/icons";
import { Badge, Tag, Tooltip, Button, Popover, Input } from "antd";
import dayjs from "dayjs";
import isoWeek from "dayjs/plugin/isoWeek";
import React, { useMemo } from "react";
import { useRouter } from "next/navigation";
import "./AppointmentWeeklyView.scss";

dayjs.extend(isoWeek);

interface AppointmentItem {
  id: string;
  candidateName: string;
  date: string;
  startTime: string;
  endTime: string;
  status: string;
  jobTitle?: string;
  department?: string;
  interviewType?: "online" | "offline";
  location?: string;
  meetingLink?: string;
  interviewer?: string;
  guidePersonName?: string;
  notes?: string;
}

interface AppointmentWeeklyViewProps {
  data: AppointmentItem[];
  dateRange: { start: dayjs.Dayjs; end: dayjs.Dayjs };
  type: "interview" | "jobOffer";
  onItemClick?: (item: AppointmentItem) => void;
  statusOptions?: Array<{ label: string; value: string }>;
  filterDropdown?: React.ReactNode;
  IsHumanPV?: boolean;
  onAccept?: (item: AppointmentItem) => void;
  onReject?: (item: AppointmentItem, reason: string) => void;
}

const AppointmentWeeklyView: React.FC<AppointmentWeeklyViewProps> = ({
  data,
  dateRange,
  type,
  onItemClick,
  statusOptions = [],
  filterDropdown,
  IsHumanPV = false,
  onAccept,
  onReject,
}) => {
  const { start, end } = dateRange;
  const router = useRouter();

  // Generate array of days in the week
  const days = useMemo(() => {
    const daysArray: dayjs.Dayjs[] = [];
    let day = start;

    while (day.isBefore(end) || day.isSame(end, "day")) {
      daysArray.push(day);
      day = day.add(1, "day");
    }

    return daysArray;
  }, [start, end]);

  // Group appointments by time slot
  const timeSlots = useMemo(() => {
    const slots: Record<string, AppointmentItem[]> = {};

    data.forEach((item) => {
      const timeKey = `${item.startTime}-${item.endTime}`;
      if (!slots[timeKey]) {
        slots[timeKey] = [];
      }
      slots[timeKey].push(item);
    });

    // Sort by start time
    return Object.entries(slots)
      .sort(([keyA], [keyB]) => {
        const timeA = keyA.split("-")[0];
        const timeB = keyB.split("-")[0];
        return timeA.localeCompare(timeB);
      })
      .map(([timeKey, appointments]) => ({
        startTime: timeKey.split("-")[0],
        endTime: timeKey.split("-")[1],
        timeKey,
        appointments,
      }));
  }, [data]);

  const getStatusColor = (status: string) => {
    const statusMap: Record<string, string> = {
      PENDING: "gold",
      ACCEPTED: "blue",
      REJECTED: "red",
      COMPLETED: "green",
      CANCELLED: "default",
    };
    return statusMap[status] || "default";
  };

  const getDayName = (date: dayjs.Dayjs) => {
    const dayNames = ["CN", "T2", "T3", "T4", "T5", "T6", "T7"];
    return dayNames[date.day()];
  };

  const getAppointmentsForTimeSlot = (
    timeKey: string,
    date: dayjs.Dayjs
  ): AppointmentItem[] => {
    return data.filter(
      (item) =>
        `${item.startTime}-${item.endTime}` === timeKey &&
        dayjs(item.date).format("YYYY-MM-DD") === date.format("YYYY-MM-DD")
    );
  };

  // Count items by status for legend
  const statusCountMap = useMemo(() => {
    const counts: Record<string, number> = {};
    data.forEach((item) => {
      counts[item.status] = (counts[item.status] || 0) + 1;
    });
    return counts;
  }, [data]);

  const getDetailPath = (item: AppointmentItem) => {
    if (type === "interview") {
      return `/tac-vu-nhan-su/phong-van-nhan-viec/phong-van/${item.id}`;
    }
    return `/tac-vu-nhan-su/phong-van-nhan-viec/nhan-viec/${item.id}`;
  };

  return (
    <div className={`appointment-weekly-view ${IsHumanPV ? "human-pv" : ""}`}>
      <div className="weekly-header">
        <div className="header-content">
          <h3>
            {type === "interview" ? "Lịch phỏng vấn" : "Lịch nhận việc"} tuần:{" "}
            {start.format("DD/MM/YYYY")} - {end.format("DD/MM/YYYY")}
          </h3>
          {filterDropdown && (
            <div className="header-filter">{filterDropdown}</div>
          )}
        </div>
      </div>

      <div className="weekly-legend">
        <div className="legend-title">Trạng thái:</div>
        <div className="legend-items">
          {statusOptions.map((status) => (
            <div key={status.value} className="legend-item">
              <Badge
                count={statusCountMap[status.value] || 0}
                overflowCount={999}
                size="small"
              >
                <Tag color={getStatusColor(status.value)}>{status.label}</Tag>
              </Badge>
            </div>
          ))}
        </div>
      </div>

      <div className="weekly-calendar">
        <table className="appointment-table">
          <thead>
            <tr>
              <th className="time-column">
                <div>Thời gian</div>
              </th>
              {days.map((day) => (
                <th
                  key={day.format("YYYY-MM-DD")}
                  className={`day-column ${
                    day.isSame(dayjs(), "day") ? "is-today" : ""
                  }`}
                >
                  <div className="day-header">
                    <div className="day-name">{getDayName(day)}</div>
                    <div className="day-date">{day.format("DD/MM")}</div>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {timeSlots.length === 0 ? (
              <tr>
                <td colSpan={days.length + 1} className="empty-state">
                  <div className="empty-content">
                    <div className="empty-icon">📅</div>
                    <p>
                      Không có{" "}
                      {type === "interview"
                        ? "lịch phỏng vấn"
                        : "lịch nhận việc"}{" "}
                      nào trong tuần này
                    </p>
                  </div>
                </td>
              </tr>
            ) : (
              timeSlots.map((slot) => (
                <tr key={slot.timeKey}>
                  <td className="time-slot">
                    <div className="time-cell">
                      <ClockCircleOutlined />
                      <div className="time-range">
                        <div className="time-text">{slot.startTime}</div>
                        <div className="time-divider">-</div>
                        <div className="time-text">{slot.endTime}</div>
                      </div>
                    </div>
                  </td>
                  {days.map((day) => {
                    const dayAppointments = getAppointmentsForTimeSlot(
                      slot.timeKey,
                      day
                    );
                    const isToday = day.isSame(dayjs(), "day");
                    return (
                      <td
                        key={day.format("YYYY-MM-DD")}
                        className={`appointment-cell ${
                          isToday ? "is-today" : ""
                        }`}
                      >
                        {dayAppointments.map((appointment) => (
                          <Tooltip
                            key={appointment.id}
                            title={
                              <div className="appointment-tooltip">
                                <div>
                                  <strong>{appointment.candidateName}</strong>
                                </div>
                                {appointment.jobTitle && (
                                  <div>Vị trí: {appointment.jobTitle}</div>
                                )}
                                {appointment.department && (
                                  <div>Phòng ban: {appointment.department}</div>
                                )}
                                {appointment.interviewer && (
                                  <div>
                                    Người phỏng vấn: {appointment.interviewer}
                                  </div>
                                )}
                                {appointment.guidePersonName && (
                                  <div>
                                    Người hướng dẫn:{" "}
                                    {appointment.guidePersonName}
                                  </div>
                                )}
                                <div>
                                  Thời gian: {appointment.startTime} -{" "}
                                  {appointment.endTime}
                                </div>
                                {appointment.notes && (
                                  <div>Ghi chú: {appointment.notes}</div>
                                )}
                              </div>
                            }
                            placement="top"
                          >
                            <div
                              className={`appointment-item status-${appointment.status}`}
                              onClick={() => {
                                onItemClick?.(appointment);
                                router.push(getDetailPath(appointment));
                              }}
                            >
                              {/* Card Header - Candidate Name & Status */}
                              <div className="appointment-header">
                                <div className="candidate-name-header">
                                  <UserOutlined />
                                  <strong> {appointment.jobTitle}</strong>
                                </div>
                              </div>

                              {/* Location/Meeting Info */}
                              {type === "interview" &&
                                appointment.interviewType && (
                                  <div className="appointment-location">
                                    {appointment.interviewType === "online" ? (
                                      <>
                                        <VideoCameraOutlined />
                                        <span>
                                          {appointment.meetingLink
                                            ? "Online Meeting"
                                            : "Phỏng vấn trực tuyến"}
                                        </span>
                                      </>
                                    ) : (
                                      <>
                                        <EnvironmentOutlined />
                                        <span>{"Offline"}</span>
                                      </>
                                    )}
                                  </div>
                                )}

                              {/* Handler Info */}
                              <div className="appointment-person">
                                <UserOutlined />
                                <span className="person-label">
                                  {type === "interview" ? "PV:" : "HD:"}
                                </span>
                                <span className="person-name">
                                  {type === "interview"
                                    ? appointment.interviewer ||
                                      "Chưa phân công"
                                    : appointment.guidePersonName ||
                                      "Chưa phân công"}
                                </span>
                              </div>

                              {IsHumanPV && appointment.status === "PENDING" && (
                                <div className="appointment-actions" onClick={(e) => e.stopPropagation()}>
                                  <div className="actions-hover">
                                    <Button
                                      size="small"
                                      type="primary"
                                      className="accept-btn"
                                      onClick={() => onAccept?.(appointment)}
                                    >
                                      Chấp nhận
                                    </Button>
                                    <Popover
                                      trigger="click"
                                      placement="bottomRight"
                                      overlayClassName="reject-popover"
                                      content={(
                                        <div className="reject-content">
                                          <div className="reject-title">Nhập lý do từ chối</div>
                                          <Input.TextArea
                                            className="reject-input"
                                            rows={3}
                                            maxLength={500}
                                            placeholder="Nhập lý do..."
                                            onPressEnter={(e) => {
                                              const value = (e.target as HTMLTextAreaElement).value?.trim();
                                              if (value) {
                                                onReject?.(appointment, value);
                                              }
                                            }}
                                          />
                                          <div className="reject-actions">
                                            <Button size="small">Hủy</Button>
                                            <Button
                                              size="small"
                                              danger
                                              type="primary"
                                              onClick={(ev) => {
                                                const pop = (ev.currentTarget as HTMLElement).closest(".ant-popover") as HTMLElement | null;
                                                const textarea = pop?.querySelector(".reject-input textarea") as HTMLTextAreaElement | null;
                                                const value = textarea?.value?.trim() || "";
                                                if (value) {
                                                  onReject?.(appointment, value);
                                                }
                                              }}
                                            >
                                              Xác nhận
                                            </Button>
                                          </div>
                                        </div>
                                      )}
                                    >
                                      <Button size="small" danger className="reject-btn">Từ chối</Button>
                                    </Popover>
                                  </div>
                                </div>
                              )}
                            </div>
                          </Tooltip>
                        ))}
                      </td>
                    );
                  })}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AppointmentWeeklyView;
