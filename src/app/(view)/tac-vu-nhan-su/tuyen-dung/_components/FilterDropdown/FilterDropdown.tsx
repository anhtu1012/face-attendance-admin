"use client";

import { Badge, Button, DatePicker, Dropdown, Form, Select, Space } from "antd";
import React, { useEffect, useMemo, useState } from "react";

import Cbutton from "@/components/basicUI/Cbutton";
import type { Dayjs } from "dayjs";
import dayjs from "dayjs";
import isoWeek from "dayjs/plugin/isoWeek";
import { IoFilterCircleSharp } from "react-icons/io5";
import { FilterDropdownProps, FilterValues } from ".";
import "./FilterDropdown.scss";

dayjs.extend(isoWeek);

const { RangePicker } = DatePicker;

const FilterDropdown: React.FC<FilterDropdownProps> = ({
  onFilter,
  statusOptions,
  loading,
}) => {
  const [form] = Form.useForm();
  const [open, setOpen] = useState(false);

  // compute the default range: start of current month -> end of current month
  // (user expects default to cover the whole month)
  const defaultRange = useMemo<[Dayjs, Dayjs]>(() => {
    const start = dayjs().startOf("month");
    const end = dayjs().endOf("month");
    return [start, end];
  }, []);

  // apply default filters on mount so parent receives them
  useEffect(() => {
    const vals: FilterValues = {
      fromDate: defaultRange[0].format("YYYY-MM-DD"),
      toDate: defaultRange[1].format("YYYY-MM-DD"),
      status: "OPEN",
    };
    onFilter(vals);
    setIsActive(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleFilter = () => {
    const values = form.getFieldsValue();
    const filterValues: FilterValues = {
      fromDate: defaultRange[0].format("YYYY-MM-DD"),
      toDate: defaultRange[1].format("YYYY-MM-DD"),
      status: values.status,
    };

    if (values.dateRange) {
      filterValues.fromDate = values.dateRange[0]?.format("YYYY-MM-DD");
      filterValues.toDate = values.dateRange[1]?.format("YYYY-MM-DD");
    }

    onFilter(filterValues);
    setOpen(false);
  };

  const handleReset = () => {
    form.resetFields();
    // Reset to the default date range and clear statuses
    onFilter({
      fromDate: defaultRange[0].format("YYYY-MM-DD"),
      toDate: defaultRange[1].format("YYYY-MM-DD"),
      status: "OPEN",
    });
    setIsActive(false);
    setOpen(false);
  };

  // track whether filters differ from defaults to show badge
  const [isActive, setIsActive] = useState(false);

  const onValuesChange = (
    _changedValues: Record<string, unknown>,
    allValues: unknown
  ) => {
    const vals = allValues as Record<string, unknown> | undefined;
    const dateRangeArr = vals?.dateRange as unknown as
      | [Dayjs, Dayjs]
      | undefined;
    const hasDate = !!(
      dateRangeArr &&
      dateRangeArr[0] &&
      dateRangeArr[1] &&
      (!dayjs(dateRangeArr[0]).isSame(defaultRange[0], "day") ||
        !dayjs(dateRangeArr[1]).isSame(defaultRange[1], "day"))
    );
    let hasStatus = false;
    if (vals?.status) {
      const statusVal = vals.status as unknown;
      const current = Array.isArray(statusVal)
        ? (statusVal as string[])
        : [String(statusVal)];
      hasStatus =
        current.length > 0 &&
        JSON.stringify(current) !== JSON.stringify(statusOptions);
    }
    setIsActive(hasDate || hasStatus);
  };

  const dropdownContent = (
    <div className="filter-dropdown-content">
      <Form
        form={form}
        layout="vertical"
        className="filter-form"
        initialValues={{
          dateRange: defaultRange,
          status: "OPEN",
        }}
        onValuesChange={onValuesChange}
      >
        <Form.Item label="Khoảng thời gian" name="dateRange">
          <RangePicker
            style={{ width: "100%" }}
            format="DD/MM/YYYY"
            placeholder={["Từ ngày", "Đến ngày"]}
            // add preset ranges including Today and This week
            ranges={{
              "Hôm nay": [dayjs(), dayjs()],
              "Tháng này": defaultRange,
            }}
          />
        </Form.Item>

        <Form.Item label="Trạng thái" name="status">
          <Select
            placeholder="Chọn trạng thái"
            allowClear
            options={statusOptions}
          />
        </Form.Item>

        <Form.Item className="filter-actions">
          <Space>
            <Button onClick={handleReset}>Đặt lại</Button>
            <Button type="primary" onClick={handleFilter} loading={loading}>
              Áp dụng
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </div>
  );

  return (
    <Dropdown
      open={open}
      onOpenChange={setOpen}
      dropdownRender={() => dropdownContent}
      trigger={["click"]}
      placement="bottomRight"
    >
      {/* show a dot badge on the button when any filter is active */}
      <Badge dot={isActive} offset={[0, 0]}>
        <Cbutton type="text" title="Lọc dữ liệu">
          <IoFilterCircleSharp size={20} />
        </Cbutton>
      </Badge>
    </Dropdown>
  );
};

export default FilterDropdown;
