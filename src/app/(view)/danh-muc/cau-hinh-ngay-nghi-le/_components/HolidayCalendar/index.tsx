// Holiday Calendar Component
import { CalendarOutlined } from "@ant-design/icons";
import { Badge, Calendar, Card, Descriptions, Modal, Tag, Tooltip } from "antd";
import type { Dayjs } from "dayjs";
import dayjs from "dayjs";
import "dayjs/locale/vi";
import React, { useState, useRef } from "react";
import "./HolidayCalendar.scss";

dayjs.locale("vi");

export interface Holiday {
  id: string;
  unitKey?: string;
  date: string;
  name: string;
  description?: string;
  type: "public" | "custom" | "lunar";
}

interface HolidayCalendarProps {
  holidays: Holiday[];
  selectedYear: number;
  selectedMonth: number;
  onPanelChange: (date: Dayjs) => void;
  onDateSelect: (date: Dayjs) => void;
}

const HolidayCalendar: React.FC<HolidayCalendarProps> = ({
  holidays,
  selectedYear,
  selectedMonth,
  onPanelChange,
  onDateSelect,
}) => {
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [selectedDayHolidays, setSelectedDayHolidays] = useState<Holiday[]>([]);
  const [selectedDateInfo, setSelectedDateInfo] = useState<Dayjs | null>(null);
  // Ref used to ignore onSelect events immediately after panel changes
  const ignoreSelectRef = useRef(false);

  // Get holidays for a specific date
  const getHolidaysForDate = (date: Dayjs) => {
    const dateStr = date.format("YYYY-MM-DD");
    return holidays.filter((h) => h.date === dateStr);
  };

  // Handle date click
  const handleDateClick = (date: Dayjs) => {
    if (ignoreSelectRef.current) return;

    const dayHolidays = getHolidaysForDate(date);

    if (dayHolidays.length > 0) {
      // Có holiday → hiển thị detail modal
      setSelectedDayHolidays(dayHolidays);
      setSelectedDateInfo(date);
      setDetailModalVisible(true);
    } else {
      // Không có holiday → mở modal thêm mới
      onDateSelect(date);
    }
  };

  // Get weekday name in Vietnamese
  const getWeekdayName = (date: Dayjs) => {
    const weekdays = [
      "Chủ Nhật",
      "Thứ Hai",
      "Thứ Ba",
      "Thứ Tư",
      "Thứ Năm",
      "Thứ Sáu",
      "Thứ Bảy",
    ];
    return weekdays[date.day()];
  };

  // Custom date cell renderer
  const dateCellRender = (value: Dayjs) => {
    const dayHolidays = getHolidaysForDate(value);

    if (dayHolidays.length === 0) return null;

    return (
      <div className="holiday-cell">
        {dayHolidays.map((holiday) => {
          let badgeStatus: "success" | "processing" | "warning" = "success";

          if (holiday.type === "custom") {
            badgeStatus = "processing";
          } else if (holiday.type === "lunar") {
            badgeStatus = "warning";
          }

          return (
            <Badge
              key={holiday.id}
              status={badgeStatus}
              text={
                <Tooltip title={holiday.description || holiday.name}>
                  <span className="holiday-name">{holiday.name}</span>
                </Tooltip>
              }
            />
          );
        })}
      </div>
    );
  };

  return (
    <>
      <div className="calendar-section">
        <Card
          title={
            <span>
              <CalendarOutlined /> Lịch ngày nghỉ lễ năm {selectedYear}
            </span>
          }
          className="calendar-card"
        >
          <Calendar
            fullscreen={true}
            locale={{
              lang: {
                locale: "vi",
                placeholder: "Chọn ngày",
                monthFormat: "Tháng M",
                today: "Hôm nay",
                now: "Bây giờ",
                backToToday: "Trở về hôm nay",
                ok: "OK",
                clear: "Xóa",
                month: "Tháng",
                year: "Năm",
                timeSelect: "Chọn thời gian",
                dateSelect: "Chọn ngày",
                monthSelect: "Chọn tháng",
                yearSelect: "Chọn năm",
                decadeSelect: "Chọn thập kỷ",
                yearFormat: "YYYY",
                dateFormat: "DD/MM/YYYY",
                dayFormat: "D",
                dateTimeFormat: "DD/MM/YYYY HH:mm:ss",
                monthBeforeYear: false,
                previousMonth: "Tháng trước",
                nextMonth: "Tháng sau",
                previousYear: "Năm trước",
                nextYear: "Năm sau",
                previousDecade: "Thập kỷ trước",
                nextDecade: "Thập kỷ sau",
                previousCentury: "Thế kỷ trước",
                nextCentury: "Thế kỷ sau",
                shortWeekDays: ["CN", "T2", "T3", "T4", "T5", "T6", "T7"],
                week: "Tuần",
                shortMonths: [
                  "Th1",
                  "Th2",
                  "Th3",
                  "Th4",
                  "Th5",
                  "Th6",
                  "Th7",
                  "Th8",
                  "Th9",
                  "Th10",
                  "Th11",
                  "Th12",
                ],
              },
              timePickerLocale: {
                placeholder: "Chọn thời gian",
              },
              dateFormat: "DD/MM/YYYY",
              dateTimeFormat: "DD/MM/YYYY HH:mm:ss",
              weekFormat: "YYYY-wo",
              monthFormat: "YYYY-MM",
            }}
            value={dayjs()
              .year(selectedYear)
              .month(selectedMonth)
              .startOf("month")}
            onPanelChange={(date) => {
              // Temporarily ignore select events triggered by the panel change
              ignoreSelectRef.current = true;
              window.setTimeout(() => (ignoreSelectRef.current = false), 600);
              onPanelChange(date);
            }}
            dateCellRender={dateCellRender}
            onSelect={handleDateClick}
          />
        </Card>
      </div>

      {/* Holiday Detail Modal */}
      <Modal
        title={
          selectedDateInfo && (
            <div className="detail-modal-title">
              <CalendarOutlined />
              <span>
                Ngày {selectedDateInfo.format("DD/MM/YYYY")} -{" "}
                {getWeekdayName(selectedDateInfo)}
              </span>
            </div>
          )
        }
        open={detailModalVisible}
        onCancel={() => setDetailModalVisible(false)}
        footer={null}
        width={600}
        className="holiday-detail-modal"
      >
        <div className="holiday-detail-content">
          {selectedDayHolidays.map((holiday) => (
            <Card
              key={holiday.id}
              className="detail-card"
              style={{ marginBottom: 16 }}
            >
              <div className="detail-header">
                <h3>{holiday.name}</h3>
                <Tag
                  color={
                    holiday.type === "public"
                      ? "green"
                      : holiday.type === "lunar"
                      ? "orange"
                      : "blue"
                  }
                >
                  {holiday.type === "public"
                    ? "Công cộng"
                    : holiday.type === "lunar"
                    ? "Âm lịch"
                    : "Tùy chỉnh"}
                </Tag>
              </div>

              <Descriptions column={1} bordered size="small">
                <Descriptions.Item label="Ngày">
                  {dayjs(holiday.date).format("DD/MM/YYYY")}
                </Descriptions.Item>
                <Descriptions.Item label="Thứ">
                  {getWeekdayName(dayjs(holiday.date))}
                </Descriptions.Item>
                {holiday.description && (
                  <Descriptions.Item label="Mô tả">
                    {holiday.description}
                  </Descriptions.Item>
                )}
              </Descriptions>
            </Card>
          ))}
        </div>
      </Modal>
    </>
  );
};

export default HolidayCalendar;
