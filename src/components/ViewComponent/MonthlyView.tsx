/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import { Calendar } from "antd";
import dayjs from "dayjs";
import locale from "antd/es/date-picker/locale/vi_VN";
import { getMonthNameInVietnamese } from "../../utils/dateLocalization";

interface MonthlyViewProps {
  currentDate: dayjs.Dayjs;
  scheduleData: any[];
  employeeList: any[];
  selectedEmployees: number[];
  selectedDepartment: string;
  setCurrentDate: (date: dayjs.Dayjs) => void;
  setViewType: React.Dispatch<
    React.SetStateAction<
      "day" | "week" | "month" | "list" | "card" | "gantt" | "timeline"
    >
  >;
  handleEditSchedule: (schedule: any) => void;
  getEmployeeName: (employeeId: number) => string;
  handleViewSchedule: (schedule: any) => void;
}

const MonthlyView: React.FC<MonthlyViewProps> = ({
  currentDate,
  scheduleData,
  employeeList,
  selectedEmployees,
  selectedDepartment,
  setCurrentDate,
  setViewType,
  getEmployeeName,
  handleViewSchedule,
}) => {
  // Enhanced getEmployeeName to handle API data
  const getEmployeeNameFromSchedule = (schedule: any) => {
    // If schedule has fullName from API, use it
    if (schedule.fullName) {
      return schedule.fullName;
    }
    // Otherwise use provided getEmployeeName function
    return getEmployeeName(schedule.userCode);
  };

  return (
    <div className="monthly-schedule-view">
      <h3>
        Lịch làm việc {getMonthNameInVietnamese(currentDate.month() + 1)}{" "}
        {currentDate.format("YYYY")}
      </h3>
      <Calendar
        value={currentDate}
        locale={locale}
        onSelect={(date) => {
          setCurrentDate(date);
          setViewType("day");
        }}
        dateCellRender={(date) => {
          const daySchedules = scheduleData.filter(
            (s) => s.date === date.format("YYYY-MM-DD")
          );
          const filteredSchedules = daySchedules.filter(
            (schedule) =>
              (selectedEmployees.length === 0 ||
                selectedEmployees.includes(schedule.userCode)) &&
              (selectedDepartment === "all" ||
                employeeList.find((e) => e.userCode === schedule.userCode)
                  ?.department === selectedDepartment)
          );

          return (
            <div className="calendar-day-cell">
              {filteredSchedules.length > 0 && (
                <div className="schedule-count">
                  {filteredSchedules.length} ca làm việc
                </div>
              )}
              {filteredSchedules.slice(0, 2).map((schedule) => (
                <div
                  key={schedule.id}
                  className={`calendar-schedule-item status-${schedule.status}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleViewSchedule(schedule);
                  }}
                >
                  {getEmployeeNameFromSchedule(schedule).split(" ").pop()} -{" "}
                  {schedule.shift}
                </div>
              ))}
              {filteredSchedules.length > 2 && (
                <div className="more-items">
                  +{filteredSchedules.length - 2} ca khác
                </div>
              )}
            </div>
          );
        }}
      />
    </div>
  );
};

export default MonthlyView;
