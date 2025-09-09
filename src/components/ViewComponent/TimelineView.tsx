/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  CalendarOutlined,
  ClockCircleOutlined,
  EditOutlined,
  EnvironmentOutlined,
  EyeOutlined,
} from "@ant-design/icons";
import {
  Avatar,
  Badge,
  Button,
  Card,
  Col,
  Empty,
  Row,
  Space,
  Timeline,
  Tooltip,
  Typography,
} from "antd";
import dayjs from "dayjs";
import type { JSX } from "react";
import React from "react";
import { getDayNameInVietnamese } from "../../utils/dateLocalization";

const { Text, Title } = Typography;

interface TimelineViewProps {
  dateRange: { start: dayjs.Dayjs; end: dayjs.Dayjs };
  scheduleData: any[];
  employeeList: any[];
  selectedEmployees: number[];
  selectedDepartment: string;
  handleEditSchedule: (schedule: any) => void;
  handleDeleteSchedule?: (id: string) => void;
  handleViewSchedule?: (schedule: any) => void;
  getStatusTag: (status: string) => JSX.Element;
}

const TimelineView: React.FC<TimelineViewProps> = ({
  dateRange,
  scheduleData,
  employeeList,
  selectedEmployees,
  selectedDepartment,
  handleEditSchedule,
  handleViewSchedule,
  getStatusTag,
}) => {
  const { start, end } = dateRange;

  // Filter schedules in date range and matching employee/department filters
  const filteredSchedules = scheduleData.filter((schedule) => {
    const scheduleDate = dayjs(schedule.date);
    // Fix date range filtering - the issue is in the condition structure
    const inDateRange =
      (scheduleDate.isAfter(start.startOf("day"), "day") ||
        scheduleDate.isSame(start.startOf("day"), "day")) &&
      (scheduleDate.isBefore(end.endOf("day"), "day") ||
        scheduleDate.isSame(end.endOf("day"), "day"));

    const matchesEmployeeFilter =
      selectedEmployees.length === 0 ||
      selectedEmployees.includes(schedule.employeeId);

    // Modified department filter to handle API data
    let matchesDepartmentFilter = selectedDepartment === "all";

    if (!matchesDepartmentFilter) {
      const employee = employeeList.find((e) => e.id === schedule.employeeId);
      if (employee) {
        matchesDepartmentFilter = employee.department === selectedDepartment;
      } else if (schedule.positionName) {
        // If employee not in list but schedule has position data
        matchesDepartmentFilter = schedule.positionName === selectedDepartment;
      }
    }

    return inDateRange && matchesEmployeeFilter && matchesDepartmentFilter;
  });

  // Group by date
  const dateGroups: Record<string, any[]> = {};

  filteredSchedules.forEach((schedule) => {
    if (!dateGroups[schedule.date]) {
      dateGroups[schedule.date] = [];
    }
    dateGroups[schedule.date].push(schedule);
  });

  // Sort dates
  const sortedDates = Object.keys(dateGroups).sort();

  // Helper function to get shift icon and color
  const getShiftInfo = (shiftName: string) => {
    const shiftMap: Record<
      string,
      { icon: any; color: string; label: string }
    > = {
      "Ca sáng": {
        icon: <ClockCircleOutlined />,
        color: "#52c41a",
        label: "Sáng",
      },
      "Ca chiều": {
        icon: <ClockCircleOutlined />,
        color: "#1890ff",
        label: "Chiều",
      },
      "Ca tối": {
        icon: <ClockCircleOutlined />,
        color: "#fa8c16",
        label: "Tối",
      },
      "Ca đêm": {
        icon: <ClockCircleOutlined />,
        color: "#722ed1",
        label: "Đêm",
      },
    };
    return (
      shiftMap[shiftName] || {
        icon: <ClockCircleOutlined />,
        color: "#d9d9d9",
        label: shiftName,
      }
    );
  };

  // Helper function to get employee avatar
  const getEmployeeAvatar = (employee: any, schedule: any) => {
    const displayName = employee?.name || schedule.fullName || "N/A";
    if (employee?.avatar) {
      return <Avatar src={employee.avatar} size={40} />;
    }
    return (
      <Avatar size={40} style={{ backgroundColor: "#1890ff" }}>
        {displayName.charAt(0).toUpperCase()}
      </Avatar>
    );
  };

  // Helper function to format time range
  const formatTimeRange = (startTime: string, endTime: string) => {
    if (!startTime || !endTime) return "Chưa xác định";
    return `${startTime} - ${endTime}`;
  };

  return (
    <div className="timeline-schedule-view" style={{ padding: "20px" }}>
      {/* Header Section */}
      <div style={{ marginBottom: "24px" }}>
        <Title level={3} style={{ margin: 0, color: "#1890ff" }}>
          <CalendarOutlined style={{ marginRight: "8px" }} />
          Timeline Lịch Làm Việc
        </Title>
        <Text type="secondary" style={{ fontSize: "14px" }}>
          Từ {start.format("DD/MM/YYYY")} đến {end.format("DD/MM/YYYY")} •{" "}
          {filteredSchedules.length} ca làm việc
        </Text>
      </div>

      {/* Statistics Cards */}
      <Row gutter={[16, 16]} style={{ marginBottom: "24px" }}>
        <Col xs={24} sm={12} md={6}>
          <Card size="small" style={{ textAlign: "center" }}>
            <div
              style={{ fontSize: "24px", fontWeight: "bold", color: "#1890ff" }}
            >
              {sortedDates.length}
            </div>
            <div style={{ color: "#666", fontSize: "12px" }}>Ngày làm việc</div>
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card size="small" style={{ textAlign: "center" }}>
            <div
              style={{ fontSize: "24px", fontWeight: "bold", color: "#52c41a" }}
            >
              {filteredSchedules.length}
            </div>
            <div style={{ color: "#666", fontSize: "12px" }}>Tổng ca làm</div>
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card size="small" style={{ textAlign: "center" }}>
            <div
              style={{ fontSize: "24px", fontWeight: "bold", color: "#fa8c16" }}
            >
              {new Set(filteredSchedules.map((s) => s.userCode)).size}
            </div>
            <div style={{ color: "#666", fontSize: "12px" }}>Nhân viên</div>
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card size="small" style={{ textAlign: "center" }}>
            <div
              style={{ fontSize: "24px", fontWeight: "bold", color: "#722ed1" }}
            >
              {new Set(filteredSchedules.map((s) => s.shiftCode)).size}
            </div>
            <div style={{ color: "#666", fontSize: "12px" }}>Loại ca</div>
          </Card>
        </Col>
      </Row>

      {/* Timeline Content */}
      <div className="timeline-container">
        {sortedDates.length === 0 ? (
          <Empty
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description={
              <span style={{ color: "#999" }}>
                Không có lịch làm việc trong khoảng thời gian này
              </span>
            }
          />
        ) : (
          <Timeline mode="left" style={{ paddingTop: "20px" }}>
            {sortedDates.map((date) => {
              const dateObj = dayjs(date);
              const formattedDate = `${getDayNameInVietnamese(
                dateObj
              )}, ${dateObj.format("DD/MM/YYYY")}`;
              const daySchedules = dateGroups[date];
              const isToday = dateObj.isSame(dayjs(), "day");

              // Group schedules by shift
              const shiftGroups: Record<string, any[]> = {};
              daySchedules.forEach((schedule) => {
                const shiftName = schedule.shift || "Chưa xác định";
                if (!shiftGroups[shiftName]) {
                  shiftGroups[shiftName] = [];
                }
                shiftGroups[shiftName].push(schedule);
              });

              return (
                <Timeline.Item
                  key={date}
                  dot={
                    <div
                      style={{
                        width: "16px",
                        height: "16px",
                        borderRadius: "50%",
                        backgroundColor: isToday ? "#52c41a" : "#1890ff",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <CalendarOutlined
                        style={{
                          fontSize: "10px",
                          color: "white",
                        }}
                      />
                    </div>
                  }
                >
                  {/* Date Header */}
                  <div style={{ marginBottom: "16px" }}>
                    <Title
                      level={4}
                      style={{
                        margin: 0,
                        color: isToday ? "#52c41a" : "#1890ff",
                      }}
                    >
                      {formattedDate}
                      {isToday && (
                        <Badge
                          count="Hôm nay"
                          style={{
                            backgroundColor: "#52c41a",
                            marginLeft: "8px",
                            fontSize: "10px",
                          }}
                        />
                      )}
                    </Title>
                    <Text type="secondary" style={{ fontSize: "12px" }}>
                      {daySchedules.length} ca làm việc
                    </Text>
                  </div>

                  {/* Shifts for this date */}
                  <Row gutter={[12, 12]}>
                    {Object.entries(shiftGroups).map(
                      ([shiftName, shiftSchedules]) => {
                        const shiftInfo = getShiftInfo(shiftName);

                        return (
                          <Col key={shiftName} xs={24} lg={12} xl={12}>
                            <Card
                              size="small"
                              style={{
                                borderLeft: `4px solid ${shiftInfo.color}`,
                                boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                                transition: "all 0.3s ease",
                              }}
                              bodyStyle={{ padding: "12px" }}
                            >
                              {/* Shift Header */}
                              <div
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                  marginBottom: "8px",
                                }}
                              >
                                <span
                                  style={{
                                    color: shiftInfo.color,
                                    marginRight: "6px",
                                  }}
                                >
                                  {shiftInfo.icon}
                                </span>
                                <Text strong style={{ color: shiftInfo.color }}>
                                  {shiftInfo.label}
                                </Text>
                                <Badge
                                  count={shiftSchedules.length}
                                  style={{
                                    backgroundColor: shiftInfo.color,
                                    marginLeft: "auto",
                                  }}
                                />
                              </div>

                              {/* Employees in this shift */}
                              <Space
                                direction="vertical"
                                size="small"
                                style={{ width: "100%" }}
                              >
                                {shiftSchedules.map((schedule) => {
                                  const employee = employeeList.find(
                                    (e) => e.id === schedule.employeeId
                                  );
                                  const displayName =
                                    employee?.name ||
                                    schedule.fullName ||
                                    "N/A";

                                  return (
                                    <div
                                      key={schedule.id}
                                      style={{
                                        display: "flex",
                                        alignItems: "center",
                                        padding: "8px",
                                        backgroundColor: "#fafafa",
                                        borderRadius: "6px",
                                        transition: "all 0.2s ease",
                                        cursor: "pointer",
                                      }}
                                      onMouseEnter={(e) => {
                                        e.currentTarget.style.backgroundColor =
                                          "#e6f7ff";
                                        e.currentTarget.style.transform =
                                          "translateY(-1px)";
                                      }}
                                      onMouseLeave={(e) => {
                                        e.currentTarget.style.backgroundColor =
                                          "#fafafa";
                                        e.currentTarget.style.transform =
                                          "translateY(0)";
                                      }}
                                    >
                                      {/* Employee Avatar */}
                                      <div style={{ marginRight: "8px" }}>
                                        {getEmployeeAvatar(employee, schedule)}
                                      </div>

                                      {/* Employee Info */}
                                      <div style={{ flex: 1, minWidth: 0 }}>
                                        <div
                                          style={{
                                            fontWeight: 500,
                                            fontSize: "13px",
                                            color: "#262626",
                                            whiteSpace: "nowrap",
                                            overflow: "hidden",
                                            textOverflow: "ellipsis",
                                          }}
                                        >
                                          {displayName}
                                        </div>
                                        <div
                                          style={{
                                            fontSize: "11px",
                                            color: "#8c8c8c",
                                            display: "flex",
                                            alignItems: "center",
                                            gap: "8px",
                                          }}
                                        >
                                          <ClockCircleOutlined />
                                          {formatTimeRange(
                                            schedule.startTime,
                                            schedule.endTime
                                          )}
                                        </div>
                                        {schedule.branchName && (
                                          <div
                                            style={{
                                              fontSize: "11px",
                                              color: "#8c8c8c",
                                              display: "flex",
                                              alignItems: "center",
                                              gap: "4px",
                                            }}
                                          >
                                            <EnvironmentOutlined />
                                            {schedule.branchName}
                                          </div>
                                        )}
                                      </div>

                                      {/* Status and Actions */}
                                      <div
                                        style={{
                                          display: "flex",
                                          flexDirection: "column",
                                          alignItems: "center",
                                          gap: "4px",
                                        }}
                                      >
                                        {getStatusTag(schedule.status)}
                                        <Space size={0}>
                                          {handleViewSchedule && (
                                            <Tooltip title="Xem chi tiết">
                                              <Button
                                                type="text"
                                                size="small"
                                                icon={<EyeOutlined />}
                                                onClick={(e) => {
                                                  e.stopPropagation();
                                                  handleViewSchedule(schedule);
                                                }}
                                                style={{ padding: "0 4px" }}
                                              />
                                            </Tooltip>
                                          )}
                                          <Tooltip title="Chỉnh sửa">
                                            <Button
                                              type="text"
                                              size="small"
                                              icon={<EditOutlined />}
                                              onClick={(e) => {
                                                e.stopPropagation();
                                                handleEditSchedule(schedule);
                                              }}
                                              style={{ padding: "0 4px" }}
                                            />
                                          </Tooltip>
                                        </Space>
                                      </div>
                                    </div>
                                  );
                                })}
                              </Space>
                            </Card>
                          </Col>
                        );
                      }
                    )}
                  </Row>
                </Timeline.Item>
              );
            })}
          </Timeline>
        )}
      </div>
    </div>
  );
};

export default TimelineView;
