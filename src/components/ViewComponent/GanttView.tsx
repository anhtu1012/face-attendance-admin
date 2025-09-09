/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useRef, useEffect } from "react";
import dayjs from "dayjs";
import { getShortDayNameInVietnamese } from "@/utils/dateLocalization";
import { Tooltip } from "antd";

interface GanttViewProps {
  dateRange: { start: dayjs.Dayjs; end: dayjs.Dayjs };
  scheduleData: any[];
  selectedEmployees: number[];
  selectedDepartment: string;
  form: any;
  handleEditSchedule: (schedule: any) => void;
  handleAddSchedule: () => void;
}

const GanttView: React.FC<GanttViewProps> = ({
  dateRange,
  scheduleData,
  selectedEmployees,
  selectedDepartment,
  form,
  handleEditSchedule,
  handleAddSchedule,
}) => {
  const { start, end } = dateRange;
  const days: any = [];
  let day = start;
  // References for synchronizing scroll
  const headerRef = useRef<HTMLDivElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);

  while (day.isBefore(end) || day.isSame(end, "day")) {
    days.push(day);
    day = day.add(1, "day");
  }

  // Create a combined list of employees that includes both employeeList and
  // any employees found only in the schedule data (from API)
  const combinedEmployeeList: {
    userCode: number;
    name: string;
    department: string;
  }[] = [];

  // Add unique employees from schedule data
  scheduleData.forEach((schedule) => {
    if (
      schedule.fullName &&
      !combinedEmployeeList.find((e) => e.userCode === schedule.userCode)
    ) {
      combinedEmployeeList.push({
        userCode: schedule.userCode,
        name: schedule.fullName,
        department: schedule.positionName || "Unknown",
      });
    }
  });

  const filteredEmployees = combinedEmployeeList.filter(
    (employee) =>
      (selectedEmployees.length === 0 ||
        selectedEmployees.includes(employee.userCode)) &&
      (selectedDepartment === "all" ||
        employee.department === selectedDepartment)
  );

  // Helper function to check if a day is weekend
  const isWeekend = (day: dayjs.Dayjs) => {
    const dayOfWeek = day.day();
    return dayOfWeek === 0 || dayOfWeek === 6; // Sunday or Saturday
  };

  // Helper function to check if a day is today
  const isToday = (day: dayjs.Dayjs) => {
    return day.isSame(dayjs(), "day");
  };

  // Synchronize horizontal scrolling between header and body
  useEffect(() => {
    const headerElement = headerRef.current;
    const bodyElement = bodyRef.current;

    if (!headerElement || !bodyElement) return;

    const handleBodyScroll = () => {
      if (headerElement && bodyElement) {
        headerElement.scrollLeft = bodyElement.scrollLeft;
      }
    };

    bodyElement.addEventListener("scroll", handleBodyScroll);

    return () => {
      bodyElement.removeEventListener("scroll", handleBodyScroll);
    };
  }, []);

  return (
    <div className="gantt-schedule-view">
      <h3 className="gantt-title">
        Lịch làm việc từ {start.format("DD/MM/YYYY")} đến{" "}
        {end.format("DD/MM/YYYY")}
      </h3>

      <div className="gantt-container">
        <div className="gantt-header">
          <div className="gantt-side-header">Nhân viên</div>
          <div className="gantt-timeline-header" ref={headerRef}>
            {days.map((day: any) => (
              <div
                key={day.format("YYYY-MM-DD")}
                className={`gantt-day-header ${
                  isWeekend(day) ? "weekend" : ""
                } ${isToday(day) ? "today" : ""}`}
              >
                <div className="day-name">
                  {getShortDayNameInVietnamese(day)}
                </div>
                <div className="day-date">{day.format("DD/MM")}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="gantt-body" ref={bodyRef}>
          {filteredEmployees.length > 0 ? (
            filteredEmployees.map((employee) => {
              return (
                <div key={employee.userCode} className="gantt-row">
                  <div className="gantt-side-cell">{employee.name}</div>
                  <div className="gantt-timeline">
                    {days.map((day: any) => {
                      const daySchedules = scheduleData.filter(
                        (s) =>
                          s.userCode === employee.userCode &&
                          s.date === day.format("YYYY-MM-DD")
                      );

                      return (
                        <div
                          key={day.format("YYYY-MM-DD")}
                          className={`gantt-day-cell ${
                            isWeekend(day) ? "weekend" : ""
                          } ${isToday(day) ? "today" : ""}`}
                        >
                          {daySchedules.map((schedule) => (
                            <Tooltip
                              title={`${schedule.shift}: ${schedule.startTime}-${schedule.endTime}`}
                              key={`${schedule.userCode}-${
                                schedule.id || Math.random()
                              }`}
                              placement="top"
                            >
                              <div
                                className={`gantt-schedule-item status-${schedule.status}`}
                                onClick={() => handleEditSchedule(schedule)}
                              >
                                <span className="shift-name">
                                  {schedule.shift}
                                </span>
                                <span className="shift-time">
                                  {schedule.startTime}-{schedule.endTime}
                                </span>
                              </div>
                            </Tooltip>
                          ))}
                          {!day.isBefore(dayjs(), "day") && (
                            <div
                              className="gantt-add-button"
                              onClick={() => {
                                form.setFieldsValue({
                                  userCode: employee.userCode,
                                  date: day,
                                });
                                handleAddSchedule();
                              }}
                            >
                              <span className="add-icon">+</span>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })
          ) : (
            <div className="gantt-empty-state">
              <p>Không có dữ liệu nhân viên phù hợp với bộ lọc</p>
            </div>
          )}
        </div>
      </div>

      {filteredEmployees.length > 0 && (
        <div className="gantt-legend">
          <div className="legend-title">Trạng thái ca làm:</div>
          <div className="legend-items">
            <div className="legend-item">
              <span className="legend-color status-ACTIVE"></span>
              <span className="legend-text">Đang hoạt động</span>
            </div>
            <div className="legend-item">
              <span className="legend-color status-NOTSTARTED"></span>
              <span className="legend-text">Chưa bắt đầu</span>
            </div>
            <div className="legend-item">
              <span className="legend-color status-NOTWORK"></span>
              <span className="legend-text">Vắng mặt</span>
            </div>
            <div className="legend-item">
              <span className="legend-color status-END"></span>
              <span className="legend-text">Hoàn Thành</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GanttView;
