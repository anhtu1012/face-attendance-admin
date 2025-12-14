/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  Card,
  Table,
  Checkbox,
  TimePicker,
  Button,
  Input,
  message,
  Badge,
  Avatar,
  Empty,
  Spin,
  Tag,
  Segmented,
  Tooltip,
} from "antd";
import {
  FaCalendarWeek,
  FaUserClock,
  FaClock,
  FaUsers,
  FaChevronLeft,
  FaChevronRight,
  FaSearch,
  FaCheckCircle,
  FaList,
  FaPlus,
  FaEye,
  FaTrashAlt,
} from "react-icons/fa";
import { MdOutlineSchedule } from "react-icons/md";
import dayjs, { Dayjs } from "dayjs";
import isoWeek from "dayjs/plugin/isoWeek";
import "dayjs/locale/vi";
import LayoutContent from "@/components/LayoutContentForder/layoutContent";
import NguoiDungServices from "@/services/admin/quan-tri-he-thong/nguoi-dung.service";
import { NguoiDungItem } from "@/dtos/quan-tri-he-thong/nguoi-dung/nguoi-dung.dto";
import "./page.scss";

dayjs.extend(isoWeek);
dayjs.locale("vi");

interface SelectedEmployee {
  id: string;
  fullName: string;
  userName: string;
  faceImg?: string;
  positionName?: string;
}

interface CreatedSchedule {
  id: string;
  date: string;
  dayName: string;
  checkInTime: string;
  checkOutTime: string;
  employees: SelectedEmployee[];
  createdAt: string;
}

function Page() {
  // View Mode: "create" or "view"
  const [viewMode, setViewMode] = useState<"create" | "view">("create");
  
  // States
  const [loading, setLoading] = useState(false);
  const [employees, setEmployees] = useState<NguoiDungItem[]>([]);
  const [selectedEmployees, setSelectedEmployees] = useState<SelectedEmployee[]>([]);
  const [searchText, setSearchText] = useState("");
  const [currentWeek, setCurrentWeek] = useState<Dayjs>(dayjs());
  const [checkInTime, setCheckInTime] = useState<Dayjs | null>(dayjs().hour(8).minute(0));
  const [checkOutTime, setCheckOutTime] = useState<Dayjs | null>(dayjs().hour(17).minute(0));
  const [selectedDay, setSelectedDay] = useState<"saturday" | "sunday" | null>(null);
  const [submitting, setSubmitting] = useState(false);
  
  // Created schedules (would be fetched from API in real app)
  const [createdSchedules, setCreatedSchedules] = useState<CreatedSchedule[]>([
    {
      id: "schedule-1",
      date: dayjs().isoWeekday(6).format("YYYY-MM-DD"),
      dayName: "Thứ 7",
      checkInTime: "08:00",
      checkOutTime: "17:00",
      employees: [
        { id: "1", fullName: "Nguyễn Văn An", userName: "nguyenvanan", positionName: "Nhân viên kế toán" },
        { id: "2", fullName: "Trần Thị Bình", userName: "tranthibinh", positionName: "Nhân viên nhân sự" },
        { id: "3", fullName: "Lê Hoàng Cường", userName: "lehoangcuong", positionName: "Kỹ sư phần mềm" },
      ],
      createdAt: dayjs().subtract(1, "day").format("DD/MM/YYYY HH:mm"),
    },
    {
      id: "schedule-2",
      date: dayjs().isoWeekday(7).format("YYYY-MM-DD"),
      dayName: "Chủ Nhật",
      checkInTime: "09:00",
      checkOutTime: "18:00",
      employees: [
        { id: "4", fullName: "Phạm Minh Đức", userName: "phammilhduc", positionName: "Trưởng phòng kinh doanh" },
        { id: "5", fullName: "Hoàng Thị Em", userName: "hoangthiem", positionName: "Nhân viên marketing" },
      ],
      createdAt: dayjs().subtract(2, "day").format("DD/MM/YYYY HH:mm"),
    },
    {
      id: "schedule-3",
      date: dayjs().add(1, "week").isoWeekday(6).format("YYYY-MM-DD"),
      dayName: "Thứ 7",
      checkInTime: "07:30",
      checkOutTime: "16:30",
      employees: [
        { id: "6", fullName: "Vũ Thanh Phong", userName: "vuthanhphong", positionName: "Kỹ thuật viên" },
        { id: "7", fullName: "Ngô Thị Giang", userName: "ngothigiang", positionName: "Nhân viên hành chính" },
        { id: "8", fullName: "Đặng Văn Hải", userName: "dangvanhai", positionName: "Nhân viên kho" },
        { id: "9", fullName: "Bùi Thị Hương", userName: "buithihuong", positionName: "Kế toán trưởng" },
      ],
      createdAt: dayjs().format("DD/MM/YYYY HH:mm"),
    },
  ]);
  const [selectedSchedule, setSelectedSchedule] = useState<CreatedSchedule | null>(null);

  // Get Saturday and Sunday of current week
  const getSaturdayOfWeek = (date: Dayjs) => {
    return date.isoWeekday(6);
  };

  const getSundayOfWeek = (date: Dayjs) => {
    return date.isoWeekday(7);
  };

  const saturday = getSaturdayOfWeek(currentWeek);
  const sunday = getSundayOfWeek(currentWeek);

  // Fetch employees
  const fetchEmployees = useCallback(async () => {
    setLoading(true);
    try {
      const response = await NguoiDungServices.getNguoiDung([], undefined);
      setEmployees(response.data || []);
    } catch (error) {
      console.error("Error fetching employees:", error);
      message.error("Không thể tải danh sách nhân viên");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchEmployees();
  }, [fetchEmployees]);

  // Filter employees by search text
  const filteredEmployees = employees.filter(
    (emp) =>
      emp.fullName?.toLowerCase().includes(searchText.toLowerCase()) ||
      emp.userName?.toLowerCase().includes(searchText.toLowerCase()) ||
      emp.email?.toLowerCase().includes(searchText.toLowerCase())
  );

  // Handle employee selection
  const handleEmployeeSelect = (employee: NguoiDungItem, checked: boolean) => {
    if (checked) {
      setSelectedEmployees((prev) => [
        ...prev,
        {
          id: employee.id || "",
          fullName: employee.fullName,
          userName: employee.userName,
          faceImg: employee.faceImg,
          positionName: employee.positionName,
        },
      ]);
    } else {
      setSelectedEmployees((prev) =>
        prev.filter((e) => e.id !== employee.id)
      );
    }
  };

  // Handle select all
  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedEmployees(
        filteredEmployees.map((emp) => ({
          id: emp.id || "",
          fullName: emp.fullName,
          userName: emp.userName,
          faceImg: emp.faceImg,
          positionName: emp.positionName,
        }))
      );
    } else {
      setSelectedEmployees([]);
    }
  };

  // Navigate weeks
  const goToPreviousWeek = () => {
    setCurrentWeek((prev) => prev.subtract(1, "week"));
  };

  const goToNextWeek = () => {
    setCurrentWeek((prev) => prev.add(1, "week"));
  };

  // Handle submit
  const handleCreateSchedule = async () => {
    if (selectedEmployees.length === 0) {
      message.warning("Vui lòng chọn ít nhất một nhân viên");
      return;
    }
    if (!selectedDay) {
      message.warning("Vui lòng chọn ngày tăng ca (Thứ 7 hoặc Chủ Nhật)");
      return;
    }
    if (!checkInTime || !checkOutTime) {
      message.warning("Vui lòng chọn giờ vào và giờ ra");
      return;
    }
    if (checkOutTime.isBefore(checkInTime)) {
      message.warning("Giờ ra phải sau giờ vào");
      return;
    }

    setSubmitting(true);
    try {
      const scheduleDate = selectedDay === "saturday" ? saturday : sunday;
      
      // Create new schedule object
      const newSchedule: CreatedSchedule = {
        id: `schedule-${Date.now()}`,
        date: scheduleDate.format("YYYY-MM-DD"),
        dayName: selectedDay === "saturday" ? "Thứ 7" : "Chủ Nhật",
        checkInTime: checkInTime.format("HH:mm"),
        checkOutTime: checkOutTime.format("HH:mm"),
        employees: [...selectedEmployees],
        createdAt: dayjs().format("DD/MM/YYYY HH:mm"),
      };

      // TODO: Call API to create schedule
      // await OvertimeScheduleServices.create(scheduleData);
      
      // Add to local state
      setCreatedSchedules((prev) => [newSchedule, ...prev]);
      
      message.success(
        `Đã tạo lịch tăng ca cho ${selectedEmployees.length} nhân viên vào ${
          selectedDay === "saturday" ? "Thứ 7" : "Chủ Nhật"
        } (${scheduleDate.format("DD/MM/YYYY")})`
      );

      // Reset selection after success
      setSelectedEmployees([]);
      setSelectedDay(null);
    } catch (error) {
      console.error("Error creating schedule:", error);
      message.error("Không thể tạo lịch tăng ca");
    } finally {
      setSubmitting(false);
    }
  };

  // Delete schedule
  const handleDeleteSchedule = (scheduleId: string) => {
    setCreatedSchedules((prev) => prev.filter((s) => s.id !== scheduleId));
    if (selectedSchedule?.id === scheduleId) {
      setSelectedSchedule(null);
    }
    message.success("Đã xóa lịch tăng ca");
  };

  // Employee table columns
  const employeeColumns = [
    {
      title: (
        <Checkbox
          checked={
            selectedEmployees.length > 0 &&
            selectedEmployees.length === filteredEmployees.length
          }
          indeterminate={
            selectedEmployees.length > 0 &&
            selectedEmployees.length < filteredEmployees.length
          }
          onChange={(e) => handleSelectAll(e.target.checked)}
        />
      ),
      dataIndex: "select",
      key: "select",
      width: 50,
      render: (_: any, record: NguoiDungItem) => (
        <Checkbox
          checked={selectedEmployees.some((e) => e.id === record.id)}
          onChange={(e) => handleEmployeeSelect(record, e.target.checked)}
        />
      ),
    },
    {
      title: "Nhân viên",
      dataIndex: "fullName",
      key: "fullName",
      render: (_: any, record: NguoiDungItem) => (
        <div className="employee-info">
          <Avatar src={record.faceImg} size={36}>
            {record.fullName?.charAt(0)}
          </Avatar>
          <div className="employee-details">
            <span className="employee-name">{record.fullName}</span>
            <span className="employee-position">{record.positionName || record.email}</span>
          </div>
        </div>
      ),
    },
  ];

  // Schedule list columns
  const scheduleColumns = [
    {
      title: "Ngày",
      dataIndex: "dayName",
      key: "dayName",
      width: 100,
      render: (text: string, record: CreatedSchedule) => (
        <div className="schedule-day">
          <Tag color="blue">{text}</Tag>
          <span className="date-text">{dayjs(record.date).format("DD/MM/YYYY")}</span>
        </div>
      ),
    },
    {
      title: "Thời gian",
      key: "time",
      width: 120,
      render: (_: any, record: CreatedSchedule) => (
        <span className="time-range">
          {record.checkInTime} - {record.checkOutTime}
        </span>
      ),
    },
    {
      title: "Số NV",
      key: "employeeCount",
      width: 80,
      render: (_: any, record: CreatedSchedule) => (
        <Tag color="green">{record.employees.length} NV</Tag>
      ),
    },
    {
      title: "Thao tác",
      key: "actions",
      width: 100,
      render: (_: any, record: CreatedSchedule) => (
        <div className="action-buttons">
          <Tooltip title="Xem chi tiết">
            <Button
              type="text"
              icon={<FaEye />}
              size="small"
              onClick={() => setSelectedSchedule(record)}
              className="view-btn"
            />
          </Tooltip>
          <Tooltip title="Xóa">
            <Button
              type="text"
              icon={<FaTrashAlt />}
              size="small"
              danger
              onClick={() => handleDeleteSchedule(record.id)}
            />
          </Tooltip>
        </div>
      ),
    },
  ];

  // Render Create Mode Content
  const renderCreateMode = () => (
    <>
      {/* Page Header */}
      <div className="pageHeader">
        <div className="headerContent">
          <h1 className="pageTitle">
            <FaUserClock className="header-icon" />
            Chọn Nhân Viên Tăng Ca
          </h1>
          <p className="dateRange">
            Tuần {currentWeek.isoWeek()}: {saturday.format("DD/MM")} - {sunday.format("DD/MM/YYYY")}
          </p>
        </div>
        <div className="totalSummary">
          <div className="summaryLabel">Đã chọn</div>
          <div className="summaryValue">{selectedEmployees.length}</div>
        </div>
      </div>

      {/* Search */}
      <div className="searchWrapper">
        <Input
          placeholder="Tìm kiếm nhân viên..."
          prefix={<FaSearch className="search-icon" />}
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          allowClear
          className="searchInput"
        />
      </div>

      {/* Employee List */}
      <div className="employeeList">
        <Spin spinning={loading}>
          <Table
            dataSource={filteredEmployees}
            columns={employeeColumns}
            rowKey="id"
            pagination={{
              pageSize: 10,
              showSizeChanger: false,
              showTotal: (total) => `Tổng ${total} nhân viên`,
            }}
            size="small"
            locale={{
              emptyText: (
                <Empty
                  image={Empty.PRESENTED_IMAGE_SIMPLE}
                  description="Không có nhân viên"
                />
              ),
            }}
          />
        </Spin>
      </div>

      {/* Selected employees chips */}
      {selectedEmployees.length > 0 && (
        <div className="selectedChips">
          <div className="chips-header">
            <FaCheckCircle className="chips-icon" />
            <span>Nhân viên đã chọn:</span>
          </div>
          <div className="chips-container">
            {selectedEmployees.slice(0, 5).map((emp) => (
              <Tag
                key={emp.id}
                closable
                onClose={() =>
                  setSelectedEmployees((prev) =>
                    prev.filter((e) => e.id !== emp.id)
                  )
                }
                className="employee-chip"
              >
                {emp.fullName}
              </Tag>
            ))}
            {selectedEmployees.length > 5 && (
              <Tag className="more-chip">
                +{selectedEmployees.length - 5} khác
              </Tag>
            )}
          </div>
        </div>
      )}
    </>
  );

  // Render View Mode Content
  const renderViewMode = () => (
    <>
      {/* Page Header */}
      <div className="pageHeader">
        <div className="headerContent">
          <h1 className="pageTitle">
            <FaList className="header-icon" />
            Lịch Tăng Ca Đã Tạo
          </h1>
          <p className="dateRange">
            Tuần {currentWeek.isoWeek()}: {saturday.format("DD/MM")} - {sunday.format("DD/MM/YYYY")}
          </p>
        </div>
        <div className="totalSummary">
          <div className="summaryLabel">Tổng lịch</div>
          <div className="summaryValue">{createdSchedules.length}</div>
        </div>
      </div>

      {/* Schedule List */}
      <div className="scheduleList">
        <Table
          dataSource={createdSchedules}
          columns={scheduleColumns}
          rowKey="id"
          pagination={false}
          size="small"
          onRow={(record) => ({
            onClick: () => setSelectedSchedule(record),
            className: selectedSchedule?.id === record.id ? "selected-row" : "",
          })}
          locale={{
            emptyText: (
              <Empty
                image={Empty.PRESENTED_IMAGE_SIMPLE}
                description="Chưa có lịch tăng ca nào"
              >
                <Button 
                  type="primary" 
                  icon={<FaPlus />}
                  onClick={() => setViewMode("create")}
                >
                  Tạo lịch mới
                </Button>
              </Empty>
            ),
          }}
        />
      </div>

      {/* Selected Schedule Details */}
      {selectedSchedule && (
        <div className="scheduleDetail">
          <div className="detail-header">
            <FaCalendarWeek className="detail-icon" />
            <span>Chi tiết lịch: {selectedSchedule.dayName} - {dayjs(selectedSchedule.date).format("DD/MM/YYYY")}</span>
          </div>
          <div className="detail-time">
            <FaClock className="time-icon" />
            <span>{selectedSchedule.checkInTime} - {selectedSchedule.checkOutTime}</span>
          </div>
          <div className="detail-employees">
            <div className="employees-header">
              <FaUsers className="users-icon" />
              <span>Danh sách nhân viên ({selectedSchedule.employees.length})</span>
            </div>
            <div className="employees-list">
              {selectedSchedule.employees.map((emp) => (
                <div key={emp.id} className="employee-item">
                  <Avatar src={emp.faceImg} size={32}>
                    {emp.fullName?.charAt(0)}
                  </Avatar>
                  <div className="emp-info">
                    <span className="emp-name">{emp.fullName}</span>
                    <span className="emp-position">{emp.positionName}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );

  return (
    <LayoutContent
      layoutType={5}
      option={{
        cardTitle: (
          <div className="page-title-wrapper">
            <FaCalendarWeek className="title-icon" />
            <span>Lịch Tăng Ca Cuối Tuần</span>
            <Segmented
              value={viewMode}
              onChange={(value) => setViewMode(value as "create" | "view")}
              options={[
                {
                  label: (
                    <span className="segment-label">
                      <FaPlus /> Tạo mới
                    </span>
                  ),
                  value: "create",
                },
                {
                  label: (
                    <span className="segment-label">
                      <FaEye /> Xem lịch
                    </span>
                  ),
                  value: "view",
                },
              ]}
              className="mode-segmented"
            />
          </div>
        ),
        floatButton: true,
        sizeAdjust: [4, 6],
      }}
      content1={
        <div className="overtime-page">
          {viewMode === "create" ? renderCreateMode() : renderViewMode()}
        </div>
      }
      content2={
        <div className="overtime-page">
          {/* Weekend Calendar */}
          <Card className="regionCard calendarCard">
            <div className="cardHeader">
              <div className="icon">
                <FaCalendarWeek />
              </div>
              <h3 className="title">Lịch Cuối Tuần</h3>
            </div>

            {/* Week Navigation */}
            <div className="weekNavigation">
              <Button
                type="text"
                icon={<FaChevronLeft />}
                onClick={goToPreviousWeek}
                className="nav-btn"
              />
              <span className="week-label">
                Tuần {currentWeek.isoWeek()} / {currentWeek.year()}
              </span>
              <Button
                type="text"
                icon={<FaChevronRight />}
                onClick={goToNextWeek}
                className="nav-btn"
              />
            </div>

            {/* Weekend Days */}
            <div className="weekendDays">
              <div
                className={`dayCard ${selectedDay === "saturday" ? "selected" : ""}`}
                onClick={() => viewMode === "create" && setSelectedDay("saturday")}
              >
                <div className="dayHeader">
                  <span className="dayName">Thứ 7</span>
                  <Badge
                    status={selectedDay === "saturday" ? "success" : "default"}
                  />
                </div>
                <div className="dayDate">{saturday.format("DD/MM/YYYY")}</div>
                <div className="dayInfo">
                  {selectedDay === "saturday" && selectedEmployees.length > 0 && (
                    <Tag color="blue">{selectedEmployees.length} NV</Tag>
                  )}
                  {viewMode === "view" && (
                    <Tag color="purple">
                      {createdSchedules.filter(s => s.date === saturday.format("YYYY-MM-DD")).length} lịch
                    </Tag>
                  )}
                </div>
              </div>

              <div
                className={`dayCard ${selectedDay === "sunday" ? "selected" : ""}`}
                onClick={() => viewMode === "create" && setSelectedDay("sunday")}
              >
                <div className="dayHeader">
                  <span className="dayName">Chủ Nhật</span>
                  <Badge
                    status={selectedDay === "sunday" ? "success" : "default"}
                  />
                </div>
                <div className="dayDate">{sunday.format("DD/MM/YYYY")}</div>
                <div className="dayInfo">
                  {selectedDay === "sunday" && selectedEmployees.length > 0 && (
                    <Tag color="blue">{selectedEmployees.length} NV</Tag>
                  )}
                  {viewMode === "view" && (
                    <Tag color="purple">
                      {createdSchedules.filter(s => s.date === sunday.format("YYYY-MM-DD")).length} lịch
                    </Tag>
                  )}
                </div>
              </div>
            </div>
          </Card>

          {/* Overtime Form (only in create mode) */}
          {viewMode === "create" && (
            <Card className="statsCard formCard">
              <div className="statsHeader">
                <MdOutlineSchedule className="statsIcon" />
                <h3 className="statsTitle">Thiết Lập Ca Tăng Ca</h3>
              </div>

              <div className="formContent">
                {/* Time Selection */}
                <div className="statItem timeItem">
                  <div className="statLabelWrapper">
                    <FaClock className="statIcon" />
                    <span className="statLabel">Giờ vào ca</span>
                  </div>
                  <TimePicker
                    value={checkInTime}
                    onChange={setCheckInTime}
                    format="HH:mm"
                    className="timePicker"
                    placeholder="Chọn giờ vào"
                  />
                </div>

                <div className="statItem timeItem">
                  <div className="statLabelWrapper">
                    <FaClock className="statIcon" />
                    <span className="statLabel">Giờ ra ca</span>
                  </div>
                  <TimePicker
                    value={checkOutTime}
                    onChange={setCheckOutTime}
                    format="HH:mm"
                    className="timePicker"
                    placeholder="Chọn giờ ra"
                  />
                </div>

                {/* Summary */}
                <div className="topSection summarySection">
                  <div className="topTitle">
                    <FaUsers className="topIcon" />
                    Thông tin tăng ca
                  </div>
                  <div className="summary-content">
                    <div className="summary-row">
                      <span className="label">Số nhân viên:</span>
                      <span className="value">{selectedEmployees.length}</span>
                    </div>
                    <div className="summary-row">
                      <span className="label">Ngày tăng ca:</span>
                      <span className="value">
                        {selectedDay
                          ? selectedDay === "saturday"
                            ? `Thứ 7 - ${saturday.format("DD/MM/YYYY")}`
                            : `Chủ Nhật - ${sunday.format("DD/MM/YYYY")}`
                          : "Chưa chọn"}
                      </span>
                    </div>
                    <div className="summary-row">
                      <span className="label">Thời gian:</span>
                      <span className="value">
                        {checkInTime?.format("HH:mm")} - {checkOutTime?.format("HH:mm")}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Submit Button */}
                <Button
                  type="primary"
                  size="large"
                  block
                  className="submitBtn"
                  onClick={handleCreateSchedule}
                  loading={submitting}
                  disabled={selectedEmployees.length === 0 || !selectedDay}
                >
                  <FaUserClock className="btn-icon" />
                  Tạo Lịch Tăng Ca
                </Button>
              </div>
            </Card>
          )}

          {/* Stats Card (only in view mode) */}
          {viewMode === "view" && (
            <Card className="statsCard">
              <div className="statsHeader">
                <FaList className="statsIcon" />
                <h3 className="statsTitle">Thống Kê</h3>
              </div>

              <div className="formContent">
                <div className="statItem">
                  <div className="statLabelWrapper">
                    <FaCalendarWeek className="statIcon" />
                    <span className="statLabel">Tổng số lịch</span>
                  </div>
                  <span className="statValue">{createdSchedules.length}</span>
                </div>

                <div className="statItem">
                  <div className="statLabelWrapper">
                    <FaUsers className="statIcon" />
                    <span className="statLabel">Tổng nhân viên tăng ca</span>
                  </div>
                  <span className="statValue">
                    {createdSchedules.reduce((acc, s) => acc + s.employees.length, 0)}
                  </span>
                </div>

                <div className="statItem">
                  <div className="statLabelWrapper">
                    <FaClock className="statIcon" />
                    <span className="statLabel">Lịch Thứ 7</span>
                  </div>
                  <span className="statValue">
                    {createdSchedules.filter(s => s.dayName === "Thứ 7").length}
                  </span>
                </div>

                <div className="statItem">
                  <div className="statLabelWrapper">
                    <FaClock className="statIcon" />
                    <span className="statLabel">Lịch Chủ Nhật</span>
                  </div>
                  <span className="statValue">
                    {createdSchedules.filter(s => s.dayName === "Chủ Nhật").length}
                  </span>
                </div>
              </div>
            </Card>
          )}
        </div>
      }
    />
  );
}

export default Page;