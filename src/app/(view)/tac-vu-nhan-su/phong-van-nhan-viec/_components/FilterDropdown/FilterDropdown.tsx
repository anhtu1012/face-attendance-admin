"use client";

import {
  Badge,
  Button,
  DatePicker,
  Dropdown,
  Form,
  Input,
  Select,
  Space,
} from "antd";
import React, { useMemo, useState, useEffect } from "react";
import { FaFilter, FaSearch } from "react-icons/fa";
import { FilterDropdownProps, FilterValues } from "../../_types/filter.types";
import "./FilterDropdown.scss";
import dayjs from "dayjs";
import isoWeek from "dayjs/plugin/isoWeek";
import type { Dayjs } from "dayjs";

dayjs.extend(isoWeek);

const { RangePicker } = DatePicker;

const FilterDropdown: React.FC<FilterDropdownProps> = ({
  onFilter,
  statusOptions,
  loading,
}) => {
  const [form] = Form.useForm();
  const [open, setOpen] = useState(false);

  // compute the start and end of the current ISO week (Mon-Sun)
  const defaultRange = useMemo<[Dayjs, Dayjs]>(() => {
    const startOfWeek = dayjs().startOf("isoWeek");
    const endOfWeek = dayjs().endOf("isoWeek");
    return [startOfWeek, endOfWeek];
  }, []);

  // default selected status values (use status codes matching backend/mock data)
  const defaultStatuses = useMemo(
    () =>
      ["PENDING", "REJECTED", "ACCEPTED", "COMPLETED", "CANCELLED"] as string[],
    [] as string[]
  );

  // apply default filters on mount so parent receives them
  useEffect(() => {
    const vals: FilterValues = {
      fromDate: defaultRange[0].format("YYYY-MM-DD"),
      toDate: defaultRange[1].format("YYYY-MM-DD"),
      status: defaultStatuses,
    };
    onFilter(vals);
    // set active badge
    setIsActive(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleFilter = () => {
    const values = form.getFieldsValue();
    const filterValues: FilterValues = {
      quickSearch: values.quickSearch,
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
    onFilter({});
    setOpen(false);
  };

  // track whether filters differ from defaults to show badge
  const [isActive, setIsActive] = useState(false);

  const onValuesChange = (
    _changedValues: Record<string, unknown>,
    allValues: unknown
  ) => {
    const vals = allValues as Record<string, unknown> | undefined;
    const hasQuick = !!vals?.quickSearch;
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
        JSON.stringify(current) !== JSON.stringify(defaultStatuses);
    }
    setIsActive(hasQuick || hasDate || hasStatus);
  };

  const dropdownContent = (
    <div className="filter-dropdown-content">
      <Form
        form={form}
        layout="vertical"
        className="filter-form"
        initialValues={{
          // default the date range to current week
          dateRange: defaultRange,
          // default selected statuses
          status: defaultStatuses,
        }}
        onValuesChange={onValuesChange}
      >
        <Form.Item label="Tìm kiếm nhanh" name="quickSearch">
          <Input
            prefix={<FaSearch />}
            placeholder="Tìm theo tên, email, SĐT..."
            allowClear
          />
        </Form.Item>

        <Form.Item label="Khoảng thời gian" name="dateRange">
          <RangePicker
            style={{ width: "100%" }}
            format="DD/MM/YYYY"
            placeholder={["Từ ngày", "Đến ngày"]}
            // add preset ranges including Today and This week
            ranges={{
              "Hôm nay": [dayjs(), dayjs()],
              "Tuần này": defaultRange,
            }}
          />
        </Form.Item>

        <Form.Item label="Trạng thái" name="status">
          <Select
            mode="multiple"
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
      <Badge dot={isActive} offset={[8, 0]}>
        <Button
          type="text"
          icon={<FaFilter />}
          className="filter-button"
          title="Lọc dữ liệu"
        >
          Lọc
        </Button>
      </Badge>
    </Dropdown>
  );
};

export default FilterDropdown;
