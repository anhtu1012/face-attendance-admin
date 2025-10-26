"use client";

// Holiday List Component
import Cbutton from "@/components/basicUI/Cbutton";
import { CalendarOutlined, DeleteOutlined } from "@ant-design/icons";
import { App, Card, Empty, Tag } from "antd";
import dayjs from "dayjs";
import React from "react";
import type { Holiday } from "../HolidayCalendar";
import "./HolidayList.scss";

interface HolidayListProps {
  holidays: Holiday[];
  selectedMonth: number;
  selectedYear: number;
  onDelete: (id: string) => void;
}

const HolidayList: React.FC<HolidayListProps> = ({
  holidays,
  selectedMonth,
  selectedYear,
  onDelete,
}) => {
  const { modal } = App.useApp();
  const handleDelete = (id: string, name: string) => {
    modal.confirm({
      title: "Xác nhận xóa",
      content: `Bạn có chắc chắn muốn xóa ngày nghỉ lễ "${name}"?`,
      okText: "Xóa",
      okType: "danger",
      cancelText: "Hủy",
      onOk: () => onDelete(id),
    });
  };

  return (
    <div className="holiday-list-section">
      <Card
        title={
          <span>
            <CalendarOutlined /> Danh sách ngày nghỉ lễ tháng{" "}
            {selectedMonth + 1}/{selectedYear}
          </span>
        }
        className="holiday-list-card"
      >
        {holidays.length === 0 ? (
          <Empty description="Không có ngày nghỉ lễ trong tháng này" />
        ) : (
          <div className="holiday-items">
            {holidays.map((holiday) => {
              const holidayDate = dayjs(holiday.date);

              return (
                <div
                  key={holiday.id}
                  className={`holiday-item ${holiday.type}`}
                >
                  <div className="holiday-date">
                    <div className="date-day">{holidayDate.format("DD")}</div>
                    <div className="date-month">
                      Tháng {holidayDate.format("MM")}
                    </div>
                  </div>

                  <div className="holiday-details">
                    <div className="holiday-title">
                      <span className="name">{holiday.name}</span>
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

                    {holiday.description && (
                      <div className="holiday-desc">{holiday.description}</div>
                    )}
                  </div>

                  {holiday.type === "custom" && (
                    <Cbutton
                      customVariant="default"
                      icon={<DeleteOutlined />}
                      onClick={() => handleDelete(holiday.id, holiday.name)}
                      className="delete-btn"
                      danger
                    />
                  )}
                </div>
              );
            })}
          </div>
        )}
      </Card>
    </div>
  );
};

export default HolidayList;
