"use client";
import React, { useState, useEffect, useMemo } from "react";
import { Spin } from "antd";
import type { Dayjs } from "dayjs";
import dayjs from "dayjs";
import LayoutContent from "@/components/LayoutContentForder/layoutContent";
import { useAntdMessage } from "@/hooks/AntdMessageProvider";
import HolidayStats from "./_components/HolidayStats";
import HolidayControls from "./_components/HolidayControls";
import AddHolidayModal from "./_components/AddHolidayModal";
import HolidayCalendar from "./_components/HolidayCalendar";
import HolidayList from "./_components/HolidayList";
import type { Holiday } from "./_components/HolidayCalendar";
import { getVietnameseLunarHolidays } from "@/utils/lunarCalendar";
import CreateYearHolidaysModal from "./_components/CreateYearHolidaysModal";
import HolidayApiService from "@/services/danh-muc/holiday/holiday.service";
import "./styles.scss";
import { StatisticType } from "@/dtos/danhMuc/holiday-config/holiday-config.dto";

interface PublicHolidayAPI {
  date: string;
  localName: string;
  name: string;
  countryCode: string;
  fixed: boolean;
  global: boolean;
  counties: string[] | null;
  launchYear: number | null;
  types: string[];
}

function Page() {
  const messageApi = useAntdMessage();
  const [selectedYear, setSelectedYear] = useState(dayjs().year());
  const [selectedMonth, setSelectedMonth] = useState(dayjs().month());
  const [holidays, setHolidays] = useState<Holiday[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Dayjs | null>(null);
  const [stats, setStats] = useState<StatisticType>();

  // New modals
  const [yearHolidaysModalVisible, setYearHolidaysModalVisible] =
    useState(false);
  const [previewHolidays, setPreviewHolidays] = useState<Holiday[]>([]);
  const [selectedHolidaysToCreate, setSelectedHolidaysToCreate] = useState<
    string[]
  >([]);
  const [compensationDays, setCompensationDays] = useState<
    Array<{
      holiday: Holiday;
      compensationDate: string;
      reason: string;
    }>
  >([]);

  // Load holidays on component mount - fetch from fake API

  const loadHolidays = async () => {
    setLoading(true);
    try {
      const param = { month: selectedMonth + 1, year: selectedYear };
      const dbHolidays = await HolidayApiService.getHolidays(
        [],
        undefined,
        param
      );
      const holidays: Holiday[] = dbHolidays.data.map((h) => ({
        ...h,
        date: dayjs(h.date).format("YYYY-MM-DD"),
      }));
      setStats(dbHolidays.statistic);
      setHolidays(holidays);
    } catch (error) {
      console.error("Error loading holidays from DB:", error);
      messageApi.error("Không thể tải dữ liệu ngày nghỉ lễ");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    loadHolidays();
  }, [selectedYear, messageApi, selectedMonth]);

  // Handle adding custom holiday
  const handleAddHoliday = async (values: {
    date: Dayjs;
    name: string;
    description?: string;
    isRecurring?: boolean;
  }) => {
    try {
      setLoading(true);
      await HolidayApiService.createHolidays([
        {
          unitKey: `unitKey-custom-${values.date.format(
            "YYYYMMDD"
          )}-${Math.random().toString(36).substr(2, 9)}`,
          date: values.date.toISOString(),
          name: values.name,
          description: values.description,
          type: "custom",
        },
      ]);
      loadHolidays();
      messageApi.success("Đã thêm ngày nghỉ lễ!");
      setModalVisible(false);
    } catch (error) {
      messageApi.error("Không thể thêm ngày nghỉ lễ");
      console.error("Error adding holiday:", error);
    } finally {
      setLoading(false);
    }
  };

  // Handle delete holiday
  const handleDeleteHoliday = async (id: string) => {
    try {
      await HolidayApiService.deleteHoliday(id);
      loadHolidays();
      messageApi.success("Đã xóa ngày nghỉ lễ!");
    } catch (error) {
      messageApi.error("Không thể xóa ngày nghỉ lễ");
      console.error("Error deleting holiday:", error);
    }
  };

  // Handle reload public holidays
  const handleReloadPublicHolidays = () => {
    loadHolidays();
  };

  // Handle export (placeholder)
  const handleExport = () => {
    messageApi.info("Chức năng xuất dữ liệu đang được phát triển");
  };

  // Handle create year holidays - combined with lunar and compensation
  const handleCreateYearHolidays = async () => {
    setLoading(true);
    try {
      // 1. Fetch public holidays from API
      const response = await fetch(
        `https://date.nager.at/api/v3/PublicHolidays/${selectedYear}/VN`
      );
      const data: PublicHolidayAPI[] = await response.json();

      const publicHolidays: Holiday[] = data.map((holiday) => ({
        id: `preview-public-${holiday.date}`,
        date: holiday.date,
        name: holiday.localName,
        description: holiday.name,
        type: "public",
      }));

      // 2. Get lunar holidays
      const lunarHolidays = getVietnameseLunarHolidays(selectedYear);

      // 3. Calculate compensation days for weekend holidays
      const allHolidays = [...publicHolidays, ...lunarHolidays];
      const weekendHolidays = allHolidays.filter((h) => {
        const date = dayjs(h.date);
        const dayOfWeek = date.day();
        return dayOfWeek === 0 || dayOfWeek === 6;
      });

      // Build a set of occupied dates to avoid creating duplicate compensation days
      const occupiedDates = new Set<string>([
        ...allHolidays.map((h) => h.date),
        ...holidays.map((h) => h.date), // include existing DB holidays
      ]);

      const compensations: Array<{
        holiday: Holiday;
        compensationDate: string;
        reason: string;
      }> = [];

      for (const holiday of weekendHolidays) {
        const holidayDate = dayjs(holiday.date);
        let compensationDate = holidayDate;

        if (holidayDate.day() === 0) {
          // Sunday -> next day
          compensationDate = holidayDate.add(1, "day");
        } else if (holidayDate.day() === 6) {
          // Saturday -> add 2 days
          compensationDate = holidayDate.add(2, "day");
        }

        while (
          occupiedDates.has(compensationDate.format("YYYY-MM-DD")) ||
          compensationDate.day() === 6 ||
          compensationDate.day() === 0
        ) {
          compensationDate = compensationDate.add(1, "day");
        }

        const compStr = compensationDate.format("YYYY-MM-DD");
        // Mark this date as occupied so subsequent compensations won't collide
        occupiedDates.add(compStr);

        compensations.push({
          holiday,
          compensationDate: compStr,
          reason: `${holiday.name} rơi vào ${
            holidayDate.day() === 0 ? "Chủ Nhật" : "Thứ Bảy"
          }`,
        });
      }

      const compensationHolidays: Holiday[] = compensations.map(
        (comp, index) => ({
          id: `preview-compensation-${comp.compensationDate}-${index}`,
          date: comp.compensationDate,
          name: `Nghỉ bù: ${comp.holiday.name}`,
          description: comp.reason,
          type: "custom",
          isRecurring: false,
        })
      );

      // Combine all holidays
      const allPreviewHolidays = [
        ...publicHolidays,
        ...lunarHolidays,
        ...compensationHolidays,
      ];

      setPreviewHolidays(allPreviewHolidays);
      setSelectedHolidaysToCreate(allPreviewHolidays.map((h) => h.id));
      setCompensationDays(compensations);
      setYearHolidaysModalVisible(true);
    } catch (error) {
      messageApi.error("Không thể tải danh sách ngày nghỉ lễ");
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  // Handle confirm create year holidays
  const handleConfirmCreateYearHolidays = async () => {
    const selectedHolidays = previewHolidays.filter((h) =>
      selectedHolidaysToCreate.includes(h.id)
    );

    const holidaysToCreate = selectedHolidays.map((h) => ({
      unitKey: `unitKey-${h.id}-${Math.random().toString(36).substr(2, 9)}`,
      date: dayjs(h.date).toISOString(),
      name: h.name,
      description: h.description,
      type: h.type as "public" | "custom" | "lunar",
    }));

    try {
      setLoading(true);
      console.log("holidaysToCreate", holidaysToCreate);
      await HolidayApiService.createHolidays(holidaysToCreate);
      loadHolidays();
      messageApi.success(`Đã tạo ${holidaysToCreate.length} ngày nghỉ lễ!`);
      setYearHolidaysModalVisible(false);
    } catch (error) {
      messageApi.error("Không thể tạo ngày nghỉ lễ");
      console.error("Error creating holidays:", error);
    } finally {
      setLoading(false);
    }
  };

  // Get holidays for selected month
  const monthHolidays = useMemo(() => {
    return holidays.filter((h) => {
      const holidayDate = dayjs(h.date);
      return (
        holidayDate.year() === selectedYear &&
        holidayDate.month() === selectedMonth
      );
    });
  }, [holidays, selectedYear, selectedMonth]);

  return (
    <>
      <LayoutContent
        layoutType={1}
        content1={
          <Spin spinning={loading}>
            <div className="holiday-config-container">
              {/* Statistics Cards */}
              <HolidayStats
                publicCount={stats?.typePublic || 0}
                customCount={stats?.typeCustom || 0}
                lunarCount={stats?.typeLunar || 0}
                monthCount={stats?.totalOffMonth || 0}
                totalCount={stats?.totalOffYear || 0}
              />

              {/* Controls */}
              <HolidayControls
                selectedYear={selectedYear}
                onYearChange={setSelectedYear}
                onAddHoliday={() => {
                  setSelectedDate(dayjs());
                  setModalVisible(true);
                }}
                onCreateYearHolidays={handleCreateYearHolidays}
                onReloadPublicHolidays={handleReloadPublicHolidays}
                onExport={handleExport}
                loading={loading}
              />

              {/* Calendar View */}
              <HolidayCalendar
                holidays={holidays}
                selectedYear={selectedYear}
                selectedMonth={selectedMonth}
                onPanelChange={(date) => {
                  setSelectedYear(date.year());
                  setSelectedMonth(date.month());
                }}
                onDateSelect={(date) => {
                  setSelectedDate(date);
                  setModalVisible(true);
                }}
              />

              {/* Holiday List */}
              <HolidayList
                holidays={monthHolidays}
                selectedMonth={selectedMonth}
                selectedYear={selectedYear}
                onDelete={handleDeleteHoliday}
              />
            </div>
          </Spin>
        }
      />

      {/* Add Holiday Modal */}
      <AddHolidayModal
        visible={modalVisible}
        onCancel={() => {
          setModalVisible(false);
          setSelectedDate(null);
        }}
        onSubmit={handleAddHoliday}
        initialDate={selectedDate}
        loading={loading}
      />

      {/* Create Year Holidays Modal */}
      <CreateYearHolidaysModal
        open={yearHolidaysModalVisible}
        onClose={() => setYearHolidaysModalVisible(false)}
        previewHolidays={previewHolidays}
        selectedHolidaysToCreate={selectedHolidaysToCreate}
        setSelectedHolidaysToCreate={setSelectedHolidaysToCreate}
        compensationDays={compensationDays}
        onConfirm={handleConfirmCreateYearHolidays}
        selectedYear={selectedYear}
      />
    </>
  );
}

export default Page;
