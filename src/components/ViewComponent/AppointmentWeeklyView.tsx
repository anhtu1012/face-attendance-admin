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
import { useSelector } from "react-redux";
import { selectAuthLogin } from "@/lib/store/slices/loginSlice";
import { useRouter } from "next/navigation";
import "./AppointmentWeeklyView.scss";
import { AppointmentListWithInterview } from "@/dtos/tac-vu-nhan-su/phong-van-nhan-viec/appointment.dto";

dayjs.extend(isoWeek);

interface AppointmentWeeklyViewProps {
  data: AppointmentListWithInterview[];
  dateRange: { start: dayjs.Dayjs; end: dayjs.Dayjs };
  type: "interview" | "jobOffer";
  onItemClick?: (item: AppointmentListWithInterview) => void;
  statusOptions?: Array<{ label: string; value: string }>;
  filterDropdown?: React.ReactNode;
  IsHumanPV?: boolean;
  onAccept?: (item: AppointmentListWithInterview) => void;
  onReject?: (item: AppointmentListWithInterview, reason: string) => void;
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
  const { userProfile } = useSelector(selectAuthLogin);

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

  // Group appointments by time slot (only for interviews)
  const timeSlots = useMemo(() => {
    if (type === "jobOffer") {
      // For job offers, return a single "all-day" slot
      return [
        {
          startTime: "All Day",
          endTime: "",
          timeKey: "all-day",
          appointments: data,
        },
      ];
    }

    const slots: Record<string, AppointmentListWithInterview[]> = {};

    data.forEach((item) => {
      const timeKey = `${dayjs(item.startTime).format("HH:mm")}-${dayjs(
        item.endTime
      ).format("HH:mm")}`;
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
  }, [data, type]);

  const getStatusColor = (status: string) => {
    const statusMap: Record<string, string> = {
      ACTIVE: "cyan",
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
  ): AppointmentListWithInterview[] => {
    if (type === "jobOffer") {
      // For job offers, filter by date field only
      return data.filter(
        (item) =>
          dayjs(item.date).format("YYYY-MM-DD") === date.format("YYYY-MM-DD")
      );
    }

    // For interviews, filter by time slot and interview date
    return data.filter(
      (item) =>
        `${dayjs(item.startTime).format("HH:mm")}-${dayjs(item.endTime).format(
          "HH:mm"
        )}` === timeKey &&
        dayjs(item.interviewDate).format("YYYY-MM-DD") ===
          date.format("YYYY-MM-DD")
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

  const getDetailPath = (item: AppointmentListWithInterview) => {
    // If IsHumanPV flag is set, use the human PV management route segment
    const baseSegment = IsHumanPV ? "quan-ly-phong-van" : "phong-van-nhan-viec";
    if (type === "interview") {
      return `/tac-vu-nhan-su/${baseSegment}/phong-van/${item.id}`;
    }
    // For job offers, use receiveJobId instead of id
    return `/tac-vu-nhan-su/${baseSegment}/nhan-viec/${
      item.receiveJobId || item.id
    }`;
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
                      {type === "jobOffer" ? (
                        <div className="all-day-label">Cả ngày</div>
                      ) : (
                        <>
                          <ClockCircleOutlined />
                          <div className="time-range">
                            <div className="time-text">{slot.startTime}</div>
                            <div className="time-divider">-</div>
                            <div className="time-text">{slot.endTime}</div>
                          </div>
                        </>
                      )}
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
                                {type === "interview" ? (
                                  <>
                                    <div>
                                      <strong>
                                        {appointment.candidateName}
                                      </strong>
                                    </div>
                                    {appointment.jobInfor?.jobTitle && (
                                      <div>
                                        Vị trí: {appointment.jobInfor?.jobTitle}
                                      </div>
                                    )}
                                  </>
                                ) : (
                                  <>
                                    <div>
                                      <strong>
                                        {appointment.jobInfor?.jobTitle}
                                      </strong>
                                    </div>
                                    {appointment.positionInfor
                                      ?.positionName && (
                                      <div>
                                        Vị trí:{" "}
                                        {
                                          appointment.positionInfor
                                            ?.positionName
                                        }
                                      </div>
                                    )}
                                  </>
                                )}
                                {/* {appointment. && (
                                  <div>Phòng ban: {appointment.department}</div>
                                )} */}
                                {type === "interview" &&
                                  appointment.listInterviewers && (
                                    <div>
                                      <div>Người phỏng vấn:</div>
                                      {Array.isArray(
                                        appointment.listInterviewers
                                      ) ? (
                                        appointment.listInterviewers.length ? (
                                          appointment.listInterviewers.map(
                                            (iv, i) => (
                                              <div key={i}>
                                                {iv.interviewerName}
                                              </div>
                                            )
                                          )
                                        ) : (
                                          <div>Chưa phân công</div>
                                        )
                                      ) : (
                                        <div>
                                          {appointment.listInterviewers}
                                        </div>
                                      )}
                                    </div>
                                  )}
                                {type === "jobOffer" && appointment.hrInfor && (
                                  <div>
                                    <div>
                                      HR phụ trách: {appointment.hrInfor.hrName}
                                    </div>
                                    {appointment.hrInfor.hrEmail && (
                                      <div>
                                        Email: {appointment.hrInfor.hrEmail}
                                      </div>
                                    )}
                                  </div>
                                )}
                                {/* {appointment.guidePersonName && (
                                  <div>
                                    Người hướng dẫn:{" "}
                                    {appointment.guidePersonName}
                                  </div>
                                )} */}
                                {type === "interview" ? (
                                  <div>
                                    Thời gian:{" "}
                                    {dayjs(appointment.startTime).format(
                                      "HH:mm"
                                    )}{" "}
                                    -{" "}
                                    {dayjs(appointment.endTime).format("HH:mm")}
                                  </div>
                                ) : (
                                  <div>
                                    Ngày nhận việc:{" "}
                                    {dayjs(appointment.date).format(
                                      "DD/MM/YYYY"
                                    )}
                                  </div>
                                )}
                                {appointment.note && (
                                  <div>Ghi chú: {appointment.note}</div>
                                )}
                              </div>
                            }
                            placement="top"
                          >
                            <div
                              className={`appointment-item status-${
                                appointment.status
                              } ${
                                appointment.listInterviewers &&
                                appointment.listInterviewers.length > 0
                                  ? appointment.listInterviewers.some(
                                      (iv) => iv.status === "REJECTED"
                                    ) && !IsHumanPV
                                    ? "TD_REJECTED"
                                    : ""
                                  : ""
                              }`}
                              onClick={() => {
                                onItemClick?.(appointment);
                                router.push(getDetailPath(appointment));
                              }}
                            >
                              {/* Card Header - Candidate Name & Status */}
                              <div className="appointment-header">
                                <div className="candidate-name-header">
                                  <strong>
                                    {" "}
                                    {appointment.jobInfor?.jobTitle}
                                  </strong>
                                </div>
                              </div>

                              {/* Location/Meeting Info */}
                              {type === "interview" &&
                                appointment.typeAppointment && (
                                  <div className="appointment-location">
                                    {appointment.typeAppointment ===
                                    "online" ? (
                                      <>
                                        <VideoCameraOutlined />
                                        <span>
                                          {appointment.meetingLink
                                            ? "Phỏng vấn trực tuyến"
                                            : "Phỏng vấn trực tuyến"}
                                        </span>
                                      </>
                                    ) : (
                                      <>
                                        <EnvironmentOutlined />
                                        <span>{"Phỏng vấn tại công ty"}</span>
                                      </>
                                    )}
                                  </div>
                                )}

                              {/* Handler Info */}
                              <div className="appointment-person">
                                <UserOutlined />
                                {/* <span className="person-label">TT:</span> */}
                                <span className="person-name">
                                  {type === "interview" ? (
                                    appointment.listInterviewers &&
                                    appointment.listInterviewers.length > 0 ? (
                                      appointment.listInterviewers.some(
                                        (iv) => iv.status === "REJECTED"
                                      ) && !IsHumanPV ? (
                                        <>Cập nhật PV mới</>
                                      ) : appointment.listInterviewers.filter(
                                          (iv) => iv.status === "ACCEPTED"
                                        ).length > 0 ? (
                                        <>
                                          Đã xác nhận{" "}
                                          {
                                            appointment.listInterviewers.filter(
                                              (iv) => iv.status === "ACCEPTED"
                                            ).length
                                          }
                                          /{appointment.interviewerCount}
                                        </>
                                      ) : (
                                        <>
                                          Đã xác nhận 0/
                                          {appointment.interviewerCount}
                                        </>
                                      )
                                    ) : (
                                      "Chưa phân công"
                                    )
                                  ) : (
                                    appointment.hrInfor?.hrName || "Chưa có HR"
                                  )}
                                </span>
                              </div>

                              {IsHumanPV &&
                                appointment.status === "PENDING" &&
                                appointment.listInterviewers &&
                                appointment.listInterviewers.some(
                                  (iv) =>
                                    iv.interviewerId ===
                                      String(userProfile?.id) &&
                                    iv.status === "PENDING"
                                ) && (
                                  <div
                                    className="appointment-actions"
                                    onClick={(e) => e.stopPropagation()}
                                  >
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
                                        content={
                                          <div className="reject-content">
                                            <div className="reject-title">
                                              Nhập lý do từ chối
                                            </div>
                                            <Input.TextArea
                                              className="reject-input"
                                              rows={3}
                                              maxLength={500}
                                              placeholder="Nhập lý do..."
                                              onPressEnter={(e) => {
                                                const value = (
                                                  e.target as HTMLTextAreaElement
                                                ).value?.trim();

                                                if (value) {
                                                  onReject?.(
                                                    appointment,
                                                    value
                                                  );
                                                }
                                              }}
                                            />
                                            <div
                                              className="reject-actions"
                                              style={{ marginTop: "5px" }}
                                            >
                                              <Button
                                                size="small"
                                                style={{ marginRight: "5px" }}
                                              >
                                                Hủy
                                              </Button>
                                              <Button
                                                size="small"
                                                danger
                                                type="primary"
                                                onClick={(ev) => {
                                                  const pop = (
                                                    ev.currentTarget as HTMLElement
                                                  ).closest(
                                                    ".ant-popover"
                                                  ) as HTMLElement | null;
                                                  const textarea =
                                                    pop?.querySelector(
                                                      ".reject-input"
                                                    ) as HTMLTextAreaElement | null;
                                                  const value =
                                                    textarea?.value?.trim() ||
                                                    "";
                                                  if (value) {
                                                    onReject?.(
                                                      appointment,
                                                      value
                                                    );
                                                  }
                                                }}
                                              >
                                                Xác nhận
                                              </Button>
                                            </div>
                                          </div>
                                        }
                                      >
                                        <Button
                                          size="small"
                                          danger
                                          className="reject-btn"
                                        >
                                          Từ chối
                                        </Button>
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
