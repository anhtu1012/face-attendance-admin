// Holiday Controls Component
import React from "react";
import { Space, Select } from "antd";
import {
  PlusOutlined,
  GlobalOutlined,
  DownloadOutlined,
  CalendarOutlined,
} from "@ant-design/icons";
import Cbutton from "@/components/basicUI/Cbutton";
import dayjs from "dayjs";
import "./HolidayControls.scss";

interface HolidayControlsProps {
  selectedYear: number;
  onYearChange: (year: number) => void;
  onAddHoliday: () => void;
  onReloadPublicHolidays: () => void;
  onCreateYearHolidays?: () => void;
  onExport?: () => void;
  loading?: boolean;
}

const HolidayControls: React.FC<HolidayControlsProps> = ({
  selectedYear,
  onYearChange,
  onAddHoliday,
  onReloadPublicHolidays,
  onCreateYearHolidays,
  onExport,
  loading = false,
}) => {
  // Generate year options (5 years before and after current year)
  const yearOptions = Array.from({ length: 11 }, (_, i) => {
    const year = dayjs().year() - 5 + i;
    return {
      value: year,
      label: `Năm ${year}`,
    };
  });

  return (
    <div className="holiday-controls">
      <div className="controls-left">
        <Select
          value={selectedYear}
          onChange={onYearChange}
          options={yearOptions}
          className="year-select custom-select"
          size="large"
          popupClassName="year-select-dropdown"
        />
      </div>

      <div className="controls-right">
        <Space size="middle" wrap>
          <Cbutton
            customVariant="primary"
            icon={<PlusOutlined />}
            onClick={onAddHoliday}
            disabled={loading}
            size="large"
          >
            Thêm ngày nghỉ lễ
          </Cbutton>

          {onCreateYearHolidays && (
            <Cbutton
              customVariant="primary"
              icon={<CalendarOutlined />}
              onClick={onCreateYearHolidays}
              disabled={loading}
              size="large"
            >
              Tạo ngày nghỉ trong năm
            </Cbutton>
          )}

          <Cbutton
            customVariant="default"
            icon={<GlobalOutlined />}
            onClick={onReloadPublicHolidays}
            disabled={loading}
            size="large"
          >
            Tải lại
          </Cbutton>

          {onExport && (
            <Cbutton
              customVariant="default"
              icon={<DownloadOutlined />}
              onClick={onExport}
              disabled={loading}
              size="large"
            >
              Xuất Excel
            </Cbutton>
          )}
        </Space>
      </div>
    </div>
  );
};

export default HolidayControls;
