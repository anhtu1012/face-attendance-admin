/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import LayoutContent from "@/components/LayoutContentForder/layoutContent";
import { BoPhan } from "@/dtos/danhMuc/bo-phan/bophan.dto";
import { NguoiDungItem } from "@/dtos/quan-tri-he-thong/nguoi-dung/nguoi-dung.dto";
import NguoiDungServices from "@/services/admin/quan-tri-he-thong/nguoi-dung.service";
import DanhMucBoPhanServices from "@/services/danh-muc/bo-phan/bophan.service";
import {
  Avatar,
  Badge,
  Button,
  Card,
  Checkbox,
  Empty,
  Input,
  Select,
  Spin,
  Table,
  Tag,
  Tooltip,
} from "antd";
import dayjs, { Dayjs } from "dayjs";
import "dayjs/locale/vi";
import isoWeek from "dayjs/plugin/isoWeek";
import React, { useCallback, useEffect, useState } from "react";
import {
  FaBuilding,
  FaCalendarWeek,
  FaCheckCircle,
  FaChevronLeft,
  FaChevronRight,
  FaClock,
  FaEye,
  FaList,
  FaPlus,
  FaSearch,
  FaTrashAlt,
  FaUserClock,
  FaUsers,
} from "react-icons/fa";
import { MdOutlineSchedule } from "react-icons/md";
import "./page.scss";
import { useAntdMessage } from "@/hooks/AntdMessageProvider";
import { useSelector } from "react-redux";
import { selectAuthLogin } from "@/lib/store/slices/loginSlice";
import QlNguoiDungServices from "@/services/admin/quan-li-nguoi-dung/quan-li-nguoi-dung.service";

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
  departmentName: string;
}

function Page() {
  // View Mode: "create" or "view"
  const [viewMode, setViewMode] = useState<"create" | "view">("create");
  const { companyInformation } = useSelector(selectAuthLogin);
  const messageApi = useAntdMessage();
  // Map short day names to isoWeekday numbers
  const getIsoWeekdayFromShortName = (shortName: string): number | null => {
    const dayMap: Record<string, number> = {
      T2: 1,
      T3: 2,
      T4: 3,
      T5: 4,
      T6: 5,
      T7: 6,
      CN: 7,
    };
    return dayMap[shortName] || null;
  };

  // Get off day numbers
  const offDayNumbers = (companyInformation?.offDays ?? [])
    .flatMap((day) => day.split(",").map((d) => d.trim()))
    .map(getIsoWeekdayFromShortName)
    .filter((day): day is number => day !== null);

  // States
  const [loading, setLoading] = useState(false);
  const [loadingDepartments, setLoadingDepartments] = useState(false);
  const [employees, setEmployees] = useState<NguoiDungItem[]>([]);
  const [departments, setDepartments] = useState<BoPhan[]>([]);
  const [selectedDepartment, setSelectedDepartment] = useState<BoPhan | null>(
    null
  );
  const [selectedEmployees, setSelectedEmployees] = useState<
    SelectedEmployee[]
  >([]);
  const [currentWeek, setCurrentWeek] = useState<Dayjs>(dayjs());
  const [selectedDays, setSelectedDays] = useState<number[]>([]); // 1=Mon, 2=Tue, ..., 7=Sun
  const [submitting, setSubmitting] = useState(false);

  // Created schedules (would be fetched from API in real app)
  const [createdSchedules, setCreatedSchedules] = useState<CreatedSchedule[]>(
    []
  );
  const [selectedSchedule, setSelectedSchedule] =
    useState<CreatedSchedule | null>(null);

  // Get day names in Vietnamese
  const getDayName = (isoWeekday: number): string => {
    const dayNames = [
      "",
      "Thứ 2",
      "Thứ 3",
      "Thứ 4",
      "Thứ 5",
      "Thứ 6",
      "Thứ 7",
      "Chủ Nhật",
    ];
    return dayNames[isoWeekday];
  };

  // Get all days of the week (Monday to Sunday)
  const getWeekDays = (date: Dayjs) => {
    return Array.from({ length: 7 }, (_, i) => ({
      isoWeekday: i + 1,
      date: date.isoWeekday(i + 1),
      dayName: getDayName(i + 1),
    }));
  };

  const weekDays = getWeekDays(currentWeek);

  // Fetch employees (with optional departmentId filter)
  const fetchEmployees = useCallback(async (departmentId?: string) => {
    setLoading(true);
    try {
      const params = departmentId ? { departmentId } : undefined;
      const response = await NguoiDungServices.getNguoiDung(
        [],
        undefined,
        params
      );
      setEmployees(response.data || []);
    } catch (error) {
      console.error("Error fetching employees:", error);
      messageApi.error("Không thể tải danh sách nhân viên");
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch departments
  const fetchDepartments = useCallback(async () => {
    setLoadingDepartments(true);
    try {
      const response = await DanhMucBoPhanServices.getDanhMucBoPhan(
        [],
        undefined
      );
      setDepartments(response.data || []);
    } catch (error) {
      console.error("Error fetching departments:", error);
      messageApi.error("Không thể tải danh sách phòng ban");
    } finally {
      setLoadingDepartments(false);
    }
  }, []);

  useEffect(() => {
    fetchEmployees(); // Fetch all employees initially
    fetchDepartments();
  }, [fetchEmployees, fetchDepartments]);

  // Re-fetch employees when department changes
  useEffect(() => {
    if (selectedDepartment) {
      fetchEmployees(selectedDepartment.id);
      // Clear selected employees when changing department
      setSelectedEmployees([]);
    } else {
      fetchEmployees(); // Fetch all if no department selected
    }
  }, [selectedDepartment, fetchEmployees]);

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
      setSelectedEmployees((prev) => prev.filter((e) => e.id !== employee.id));
    }
  };

  // Handle select all
  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedEmployees(
        employees.map((emp) => ({
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

  // Handle day selection (toggle multiple days)
  const handleDayToggle = (isoWeekday: number) => {
    setSelectedDays((prev) =>
      prev.includes(isoWeekday)
        ? prev.filter((d) => d !== isoWeekday)
        : [...prev, isoWeekday]
    );
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
      messageApi.warning("Vui lòng chọn ít nhất một nhân viên");
      return;
    }
    if (selectedDays.length === 0) {
      messageApi.warning("Vui lòng chọn ít nhất một ngày làm việc");
      return;
    }
    if (!selectedDepartment) {
      messageApi.warning(
        "Vui lòng chọn phòng ban để lấy thông tin ca làm việc"
      );
      return;
    }

    setSubmitting(true);
    try {
      const newSchedules: CreatedSchedule[] = selectedDays.map((isoWeekday) => {
        const scheduleDate = currentWeek.isoWeekday(isoWeekday);
        return {
          id: `schedule-${Date.now()}-${isoWeekday}`,
          date: scheduleDate.format("YYYY-MM-DD"),
          dayName: getDayName(isoWeekday),
          checkInTime: selectedDepartment.shiftStartTime
            ? dayjs(selectedDepartment.shiftStartTime).format("HH:mm")
            : "08:00",
          checkOutTime: selectedDepartment.shiftEndTime
            ? dayjs(selectedDepartment.shiftEndTime).format("HH:mm")
            : "17:00",
          employees: [...selectedEmployees],
          createdAt: dayjs().format("DD/MM/YYYY HH:mm"),
          departmentName: selectedDepartment.departmentName,
        };
      });
      const listDates = selectedDays.map((isoWeekday) => {
        return currentWeek.isoWeekday(isoWeekday).startOf("day").toISOString();
      });
      await QlNguoiDungServices.createSchedule({
        departmentId: String(selectedDepartment.id),
        listUserIds: selectedEmployees.map((e) => e.id),
        listDates: listDates,
      });

      setCreatedSchedules((prev) => [...newSchedules, ...prev]);

      messageApi.success(
        `Đã tạo lịch làm việc cho ${selectedEmployees.length} nhân viên trong ${selectedDays.length} ngày`
      );

      // Reset selection after success
      setSelectedEmployees([]);
      setSelectedDays([]);
    } catch (error) {
      console.error("Error creating schedule:", error);
      messageApi.error("Nhân viên đã có lịch làm việc trong ngày !");
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
    messageApi.success("Đã xóa lịch tăng ca");
  };

  // Employee table columns
  const employeeColumns = [
    {
      title: (
        <Checkbox
          checked={
            selectedEmployees.length > 0 &&
            selectedEmployees.length === employees.length
          }
          indeterminate={
            selectedEmployees.length > 0 &&
            selectedEmployees.length < employees.length
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
      filterDropdown: ({
        setSelectedKeys,
        selectedKeys,
        confirm,
        clearFilters,
      }: {
        setSelectedKeys: (keys: React.Key[]) => void;
        selectedKeys: React.Key[];
        confirm: () => void;
        clearFilters?: () => void;
      }) => (
        <div style={{ padding: 8 }}>
          <Input
            placeholder="Tìm kiếm nhân viên..."
            value={selectedKeys[0] as string}
            onChange={(e) =>
              setSelectedKeys(e.target.value ? [e.target.value] : [])
            }
            onPressEnter={() => confirm()}
            style={{ marginBottom: 8, display: "block" }}
            // prefix={<FaSearch style={{ color: "#999" }} />}
          />
          <div style={{ display: "flex", gap: 8 }}>
            <Button
              type="primary"
              onClick={() => confirm()}
              size="small"
              style={{ width: "50%" }}
            >
              Tìm
            </Button>
            <Button
              onClick={() => {
                if (clearFilters) clearFilters();
                confirm();
              }}
              size="small"
              style={{ width: "50%" }}
            >
              Xóa
            </Button>
          </div>
        </div>
      ),
      filterIcon: (filtered: boolean) => (
        <FaSearch style={{ color: filtered ? "#1890ff" : undefined }} />
      ),
      onFilter: (value: any, record: NguoiDungItem) =>
        record.fullName
          ?.toLowerCase()
          .includes((value as string).toLowerCase()) ||
        record.userName
          ?.toLowerCase()
          .includes((value as string).toLowerCase()) ||
        record.email?.toLowerCase().includes((value as string).toLowerCase()),
      render: (_: any, record: NguoiDungItem) => (
        <div className="employee-info">
          <Avatar src={record.faceImg} size={36}>
            {record.fullName?.charAt(0)}
          </Avatar>
          <div className="employee-details">
            <span className="employee-name">{record.fullName}</span>
            <span className="employee-position">
              {record.positionName || record.email}
            </span>
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
      width: 120,
      render: (text: string, record: CreatedSchedule) => (
        <div className="schedule-day">
          <Tag color="blue">{text}</Tag>
          <span className="date-text">
            {dayjs(record.date).format("DD/MM/YYYY")}
          </span>
        </div>
      ),
    },
    {
      title: "Phòng ban",
      dataIndex: "departmentName",
      key: "departmentName",
      width: 150,
      render: (text: string) => (
        <Tag color="purple" icon={<FaBuilding />}>
          {text}
        </Tag>
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
            Chọn Nhân Viên Làm Việc
          </h1>
          <p className="dateRange">
            Tuần {currentWeek.isoWeek()}:{" "}
            {currentWeek.startOf("isoWeek").format("DD/MM")} -{" "}
            {currentWeek.endOf("isoWeek").format("DD/MM/YYYY")}
          </p>
        </div>
        <div className="totalSummary">
          <div className="summaryLabel">Đã chọn</div>
          <div className="summaryValue">{selectedEmployees.length}</div>
        </div>
      </div>

      {/* Department Selection */}
      <Card className="departmentSelectCard" style={{ marginBottom: 16 }}>
        <div className="departmentSelectWrapper">
          <div className="selectLabel">
            <FaBuilding className="label-icon" />
            <span>Chọn phòng ban</span>
          </div>
          <Select
            value={selectedDepartment?.id}
            onChange={(value) => {
              const dept = departments.find((d) => d.id === value);
              setSelectedDepartment(dept || null);
            }}
            placeholder="Chọn phòng ban để lọc nhân viên"
            className="departmentSelect"
            loading={loadingDepartments}
            showSearch
            allowClear
            onClear={() => setSelectedDepartment(null)}
            filterOption={(input, option) =>
              (option?.label ?? "").toLowerCase().includes(input.toLowerCase())
            }
            options={departments.map((dept) => ({
              value: dept.id,
              label: dept.departmentName,
            }))}
            style={{ width: "100%" }}
          />
          {selectedDepartment && (
            <div className="selectedDeptInfo">
              <Tag
                color="blue"
                icon={<FaClock style={{ marginRight: "5px" }} />}
              >
                {selectedDepartment.shiftStartTime
                  ? dayjs(selectedDepartment.shiftStartTime).format("HH:mm")
                  : "--:--"}
                {" - "}
                {selectedDepartment.shiftEndTime
                  ? dayjs(selectedDepartment.shiftEndTime).format("HH:mm")
                  : "--:--"}
              </Tag>
              <Tag color="green">
                {selectedDepartment.totalWorkHour || 0} giờ
              </Tag>
            </div>
          )}
        </div>
      </Card>

      {/* Employee List */}
      <div className="employeeList">
        <Spin spinning={loading}>
          <Table
            dataSource={employees}
            columns={employeeColumns}
            rowKey="id"
            pagination={{
              pageSize: 10,
              showSizeChanger: true,
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
            Lịch Làm Việc Đã Tạo
          </h1>
          <p className="dateRange">
            Tuần {currentWeek.isoWeek()}:{" "}
            {currentWeek.startOf("isoWeek").format("DD/MM")} -{" "}
            {currentWeek.endOf("isoWeek").format("DD/MM/YYYY")}
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
                description="Chưa có lịch làm việc nào"
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
            <span>
              Chi tiết lịch: {selectedSchedule.dayName} -{" "}
              {dayjs(selectedSchedule.date).format("DD/MM/YYYY")}
            </span>
          </div>
          <div className="detail-department">
            <FaBuilding className="dept-icon" />
            <span>{selectedSchedule.departmentName}</span>
          </div>
          <div className="detail-time">
            <FaClock className="time-icon" />
            <span>
              {selectedSchedule.checkInTime} - {selectedSchedule.checkOutTime}
            </span>
          </div>
          <div className="detail-employees">
            <div className="employees-header">
              <FaUsers className="users-icon" />
              <span>
                Danh sách nhân viên ({selectedSchedule.employees.length})
              </span>
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
            <FaCalendarWeek className="title-icon" style={{ color: "#fff" }} />
            <span>Lịch Làm Việc</span>
            {/* <Segmented
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
            /> */}
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
          {/* Week Calendar */}
          <Card className="regionCard calendarCard">
            <div className="cardHeader">
              <div className="icon">
                <FaCalendarWeek />
              </div>
              <h3 className="title">Chọn Ngày Làm Việc</h3>
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

            {/* Week Days (Monday - Sunday) */}
            <div className="weekDays">
              {weekDays.map((day) => {
                const isOffDay = offDayNumbers.includes(day.isoWeekday);
                return (
                  <div
                    key={day.isoWeekday}
                    className={`dayCard ${
                      selectedDays.includes(day.isoWeekday) ? "selected" : ""
                    } ${isOffDay ? "off-day" : ""}`}
                    onClick={() =>
                      viewMode === "create" &&
                      !isOffDay &&
                      handleDayToggle(day.isoWeekday)
                    }
                    style={isOffDay ? { cursor: "not-allowed" } : undefined}
                  >
                    <div className="dayHeader">
                      <span className={`dayName selected `}>{day.dayName}</span>
                      {isOffDay ? (
                        <Tag
                          color="red"
                          style={{
                            fontSize: 10,
                            padding: "0 4px",
                            lineHeight: "16px",
                          }}
                        >
                          Nghỉ
                        </Tag>
                      ) : (
                        <Badge
                          status={
                            selectedDays.includes(day.isoWeekday)
                              ? "success"
                              : "default"
                          }
                        />
                      )}
                    </div>
                    <div className="dayDate">{day.date.format("DD/MM")}</div>
                    <div className="dayInfo">
                      {!isOffDay &&
                        selectedDays.includes(day.isoWeekday) &&
                        selectedEmployees.length > 0 && (
                          <Tag color="blue">{selectedEmployees.length} NV</Tag>
                        )}
                      {!isOffDay && viewMode === "view" && (
                        <Tag color="purple">
                          {
                            createdSchedules.filter(
                              (s) => s.date === day.date.format("YYYY-MM-DD")
                            ).length
                          }{" "}
                          lịch
                        </Tag>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>

          {/* Department & Shift Form (only in create mode) */}
          {viewMode === "create" && (
            <Card className="statsCard formCard">
              <div className="statsHeader">
                <MdOutlineSchedule className="statsIcon" />
                <h3 className="statsTitle">Thiết Lập Ca Làm Việc</h3>
              </div>

              <div className="formContent">
                {/* Display Shift Info */}
                {selectedDepartment ? (
                  <div className="shiftInfo">
                    <div className="info-row">
                      <FaClock className="info-icon" />
                      <span className="info-label">Giờ vào ca:</span>
                      <span className="info-value">
                        {selectedDepartment.shiftStartTime
                          ? dayjs(selectedDepartment.shiftStartTime).format(
                              "HH:mm"
                            )
                          : "Chưa thiết lập"}
                      </span>
                    </div>
                    <div className="info-row">
                      <FaClock className="info-icon" />
                      <span className="info-label">Giờ ra ca:</span>
                      <span className="info-value">
                        {selectedDepartment.shiftEndTime
                          ? dayjs(selectedDepartment.shiftEndTime).format(
                              "HH:mm"
                            )
                          : "Chưa thiết lập"}
                      </span>
                    </div>
                    <div className="info-row">
                      <FaUserClock className="info-icon" />
                      <span className="info-label">Tổng giờ làm:</span>
                      <span className="info-value">
                        {selectedDepartment.totalWorkHour || 0} giờ
                      </span>
                    </div>
                    {selectedDepartment.lunchBreak && (
                      <div className="info-row">
                        <FaClock className="info-icon" />
                        <span className="info-label">Nghỉ trưa:</span>
                        <span className="info-value">
                          {selectedDepartment.lunchBreak}
                        </span>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="noShiftInfo">
                    <FaBuilding
                      style={{
                        fontSize: 48,
                        color: "#d9d9d9",
                        marginBottom: 16,
                      }}
                    />
                    <p style={{ color: "#999", fontSize: 14 }}>
                      Chọn phòng ban bên trái để xem thông tin ca làm việc
                    </p>
                  </div>
                )}

                {/* Summary */}
                <div className="topSection summarySection">
                  <div className="topTitle">
                    <FaUsers className="topIcon" />
                    Thông tin lịch làm việc
                  </div>
                  <div className="summary-content">
                    <div className="summary-row">
                      <span className="label">Số nhân viên:</span>
                      <span className="value">{selectedEmployees.length}</span>
                    </div>
                    <div className="summary-row">
                      <span className="label">Số ngày đã chọn:</span>
                      <span className="value">{selectedDays.length} ngày</span>
                    </div>
                    <div className="summary-row">
                      <span className="label">Phòng ban:</span>
                      <span className="value">
                        {selectedDepartment
                          ? selectedDepartment.departmentName
                          : "Chưa chọn"}
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
                  disabled={
                    selectedEmployees.length === 0 ||
                    selectedDays.length === 0 ||
                    !selectedDepartment
                  }
                >
                  <FaUserClock className="btn-icon" />
                  Tạo Lịch Làm Việc
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
                    <span className="statLabel">Tổng nhân viên</span>
                  </div>
                  <span className="statValue">
                    {createdSchedules.reduce(
                      (acc, s) => acc + s.employees.length,
                      0
                    )}
                  </span>
                </div>

                <div className="statItem">
                  <div className="statLabelWrapper">
                    <FaBuilding className="statIcon" />
                    <span className="statLabel">Phòng ban</span>
                  </div>
                  <span className="statValue">
                    {
                      new Set(createdSchedules.map((s) => s.departmentName))
                        .size
                    }
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
