/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  CalendarOutlined,
  ClockCircleOutlined,
  EditOutlined,
  EnvironmentOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import {
  Avatar,
  Badge,
  Button,
  Card,
  Col,
  Empty,
  List,
  Row,
  Tooltip,
} from "antd";
import dayjs from "dayjs";
import type { JSX } from "react";
import React, { useState } from "react";

interface CardViewProps {
  dateRange: { start: dayjs.Dayjs; end: dayjs.Dayjs };
  scheduleData: any[];
  selectedEmployees: number[];
  selectedDepartment: string;
  currentDate: dayjs.Dayjs;
  form: any;
  handleAddSchedule: () => void;
  handleEditSchedule: (schedule: any) => void;
  getStatusTag: (status: string) => JSX.Element;
}

const CardView: React.FC<CardViewProps> = ({
  dateRange,
  scheduleData,
  selectedEmployees,
  selectedDepartment,
  currentDate,
  form,
  handleAddSchedule,
  handleEditSchedule,
  getStatusTag,
}) => {
  const { start, end } = dateRange;
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);

  // Filter schedules by date range first
  const schedulesInRange = scheduleData.filter((schedule) => {
    if (!schedule.date) return false;
    const scheduleDate = dayjs(schedule.date);
    return (
      (scheduleDate.isAfter(start, "day") ||
        scheduleDate.isSame(start, "day")) &&
      (scheduleDate.isBefore(end, "day") || scheduleDate.isSame(end, "day"))
    );
  });

  // Create a combined list of employees from filtered schedules
  const combinedEmployeeList: {
    userCode: number | string;
    name: string;
    department: string;
    avatar?: string;
  }[] = [];

  // Add unique employees from schedule data
  schedulesInRange.forEach((schedule) => {
    if (
      schedule.fullName &&
      !combinedEmployeeList.find((e) => e.userCode === schedule.userCode)
    ) {
      combinedEmployeeList.push({
        userCode: schedule.userCode,
        name: schedule.fullName,
        department: schedule.positionName || "Unknown",
        // No avatar for API-only employees
      });
    }
  });

  const filteredEmployees = combinedEmployeeList.filter(
    (employee) =>
      (selectedEmployees.length === 0 ||
        selectedEmployees.includes(Number(employee.userCode))) &&
      (selectedDepartment === "all" ||
        employee.department === selectedDepartment)
  );

  // Generate random background gradient for avatar if no image
  const getAvatarColor = (name: string) => {
    const colors = [
      "linear-gradient(135deg, #1890ff 0%, #096dd9 100%)",
      "linear-gradient(135deg, #52c41a 0%, #389e0d 100%)",
      "linear-gradient(135deg, #722ed1 0%, #531dab 100%)",
      "linear-gradient(135deg, #faad14 0%, #d48806 100%)",
      "linear-gradient(135deg, #f5222d 0%, #cf1322 100%)",
      "linear-gradient(135deg, #13c2c2 0%, #08979c 100%)",
    ];

    // Simple hash function
    const hash = name
      .split("")
      .reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return colors[hash % colors.length];
  };

  // Function to get initials from name
  const getInitials = (name: string) => {
    const nameParts = name.split(" ");
    if (nameParts.length >= 2) {
      return (
        nameParts[0][0] + nameParts[nameParts.length - 1][0]
      ).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  // Helper function to group schedules by date
  const getSchedulesByDate = (schedules: any[]) => {
    const grouped: Record<string, any[]> = {};

    schedules.forEach((schedule) => {
      const dateStr = schedule.date;
      if (!grouped[dateStr]) {
        grouped[dateStr] = [];
      }
      grouped[dateStr].push(schedule);
    });

    return Object.entries(grouped).sort(([dateA], [dateB]) =>
      dayjs(dateA).isAfter(dayjs(dateB)) ? 1 : -1
    );
  };

  return (
    <div className="card-schedule-view modern-card-view">
      <h3 className="page-title">
        <CalendarOutlined className="title-icon" />
        Lịch làm việc từ {start.format("DD/MM/YYYY")} đến{" "}
        {end.format("DD/MM/YYYY")}
      </h3>

      {filteredEmployees.length === 0 ? (
        <Empty
          description="Không có dữ liệu nhân viên trong khoảng thời gian này"
          className="empty-data-container"
          image={Empty.PRESENTED_IMAGE_SIMPLE}
        />
      ) : (
        <Row gutter={[16, 16]} className="employee-cards-container">
          {filteredEmployees.map((employee) => {
            // Get schedules for this employee in the date range
            const employeeSchedules = schedulesInRange.filter(
              (schedule) => schedule.userCode === employee.userCode
            );

            // Group schedules by date
            const schedulesByDate = getSchedulesByDate(employeeSchedules);

            return (
              <Col
                xs={24}
                sm={12}
                md={8}
                lg={8}
                key={employee.userCode}
                className="employee-card-col"
                onMouseEnter={() => setHoveredCard(String(employee.userCode))}
                onMouseLeave={() => setHoveredCard(null)}
              >
                <Badge.Ribbon
                  text={`${employeeSchedules.length} ca làm việc`}
                  color={employeeSchedules.length > 0 ? "blue" : "gray"}
                  className={`schedule-count-badge ${
                    hoveredCard === String(employee.userCode)
                      ? "badge-hover"
                      : ""
                  }`}
                >
                  <Card
                    title={
                      <div className="employee-card-header">
                        <Avatar
                          size={48}
                          src={employee.avatar}
                          className="employee-avatar"
                          style={
                            !employee.avatar
                              ? { background: getAvatarColor(employee.name) }
                              : {}
                          }
                        >
                          {!employee.avatar && getInitials(employee.name)}
                        </Avatar>
                        <div className="employee-info">
                          <div className="employee-name">{employee.name}</div>
                          <small className="employee-department">
                            <EnvironmentOutlined /> {employee.department}
                          </small>
                        </div>
                      </div>
                    }
                    className={`employee-schedule-card ${
                      hoveredCard === String(employee.userCode)
                        ? "card-hover"
                        : ""
                    }`}
                    extra={
                      <Tooltip title="Thêm lịch làm việc">
                        <Button
                          type="primary"
                          shape="circle"
                          icon={<PlusOutlined />}
                          size="middle"
                          onClick={(e) => {
                            e.stopPropagation();
                            form.setFieldsValue({
                              userCode: employee.userCode,
                              date: currentDate,
                            });
                            handleAddSchedule();
                          }}
                          className="add-schedule-btn"
                        />
                      </Tooltip>
                    }
                    actions={[
                      <Button
                        key="add"
                        type="text"
                        icon={<PlusOutlined />}
                        onClick={(e) => {
                          e.stopPropagation();
                          form.setFieldsValue({
                            userCode: employee.userCode,
                            date: currentDate,
                          });
                          handleAddSchedule();
                        }}
                      >
                        Thêm ca làm việc
                      </Button>,
                    ]}
                  >
                    {employeeSchedules.length === 0 ? (
                      <div className="no-schedules">
                        <Empty
                          description="Không có ca làm việc trong khoảng thời gian này"
                          image={Empty.PRESENTED_IMAGE_SIMPLE}
                        />
                      </div>
                    ) : (
                      <div className="schedules-by-date-container">
                        {schedulesByDate.map(([date, dateSchedules]) => (
                          <div key={date} className="date-group">
                            <div className="date-header">
                              <CalendarOutlined />{" "}
                              {dayjs(date).format("DD/MM (ddd)")}
                            </div>
                            <List
                              size="small"
                              dataSource={dateSchedules}
                              renderItem={(schedule) => (
                                <List.Item
                                  key={schedule.code}
                                  className={`schedule-list-item status-${schedule.status.toLowerCase()}`}
                                  actions={[
                                    <Tooltip
                                      key="edit-tooltip"
                                      title="Sửa lịch làm việc"
                                    >
                                      <Button
                                        key="edit"
                                        type="text"
                                        size="small"
                                        icon={<EditOutlined />}
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          handleEditSchedule(schedule);
                                        }}
                                        className="edit-btn"
                                      />
                                    </Tooltip>,
                                  ]}
                                  onClick={() => handleEditSchedule(schedule)}
                                >
                                  <List.Item.Meta
                                    title={
                                      <div className="schedule-title">
                                        <span>{schedule.shift}</span>
                                        <div className="schedule-status">
                                          {getStatusTag(schedule.status)}
                                        </div>
                                      </div>
                                    }
                                    description={
                                      <div className="schedule-details">
                                        <div className="time-info">
                                          <ClockCircleOutlined />{" "}
                                          {(() => {
                                            // Debug logging
                                            console.log("startTime:", schedule.startTime, typeof schedule.startTime);
                                            console.log("endTime:", schedule.endTime, typeof schedule.endTime);
                                            
                                            const formatTime = (time: any) => {
                                              if (!time) return "--:--";
                                              
                                              // If it's already in HH:mm format
                                              if (typeof time === 'string' && time.match(/^\d{2}:\d{2}$/)) {
                                                return time;
                                              }
                                              
                                              // Try to parse as dayjs
                                              const parsed = dayjs(time);
                                              if (parsed.isValid()) {
                                                return parsed.format("HH:mm");
                                              }
                                              
                                              // If it's a time string like "08:00:00"
                                              if (typeof time === 'string' && time.includes(':')) {
                                                const timeParts = time.split(':');
                                                if (timeParts.length >= 2) {
                                                  return `${timeParts[0]}:${timeParts[1]}`;
                                                }
                                              }
                                              
                                              return "--:--";
                                            };
                                            
                                            const startFormatted = formatTime(schedule.startTime);
                                            const endFormatted = formatTime(schedule.endTime);
                                            
                                            return `${startFormatted} - ${endFormatted}`;
                                          })()}
                                        </div>
                                        <div className="branch-info">
                                          <EnvironmentOutlined />{" "}
                                          {schedule.branchName ||
                                            "Không có chi nhánh"}
                                        </div>
                                      </div>
                                    }
                                  />
                                </List.Item>
                              )}
                            />
                          </div>
                        ))}
                      </div>
                    )}
                  </Card>
                </Badge.Ribbon>
              </Col>
            );
          })}
        </Row>
      )}
    </div>
  );
};

export default CardView;
