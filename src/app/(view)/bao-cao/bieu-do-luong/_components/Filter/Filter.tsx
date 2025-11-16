"use client";
import React, { forwardRef, useImperativeHandle, useState } from "react";
import { Form, Row, Col } from "antd";
import dayjs, { Dayjs } from "dayjs";
import Cbutton from "@/components/basicUI/Cbutton";
import CRangePicker from "@/components/basicUI/CrangePicker";
import Cselect from "@/components/Cselect";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { FilterProps, SalaryFilterValues } from "../../_types/salary.types";
import "./Filter.scss";

const Filter = forwardRef<
  { getFormValues: () => Partial<SalaryFilterValues>; resetForm: () => void },
  FilterProps
>(({ onSubmit }, ref) => {
  const [form] = Form.useForm();
  const [startDate, setStartDate] = useState<Dayjs | null>(
    dayjs().startOf("month")
  );
  const [endDate, setEndDate] = useState<Dayjs | null>(dayjs().endOf("month"));

  useImperativeHandle(ref, () => ({
    getFormValues: () => {
      const values = form.getFieldsValue();
      return values;
    },
    resetForm: () => {
      form.resetFields();
      setStartDate(dayjs().startOf("month"));
      setEndDate(dayjs().endOf("month"));
    },
  }));

  // Mock data for departments
  const departmentOptions = [
    { value: "all", label: "Tất cả phòng ban" },
    { value: "1", label: "Kỹ thuật" },
    { value: "2", label: "Kinh doanh" },
    { value: "3", label: "Marketing" },
    { value: "4", label: "Nhân sự" },
    { value: "5", label: "Tài chính" },
    { value: "6", label: "Hành chính" },
  ];

  return (
    <div className="salary-filter-container">
      <Form
        form={form}
        layout="vertical"
        className="salary-filter-form"
        onFinish={onSubmit}
        initialValues={{
          dateRange: [dayjs().startOf("month"), dayjs().endOf("month")],
          departmentId: "all",
        }}
      >
        <Row gutter={16}>
          <Col xs={24} sm={12} md={10}>
            <Form.Item name="dateRange" style={{ marginBottom: 0 }}>
              <CRangePicker
                label={["Từ ngày", "Đến ngày"]}
                placeholder={["", ""]}
                style={{ width: "100%", height: "40px" }}
                format={"DD/MM/YYYY"}
                value={startDate && endDate ? [startDate, endDate] : null}
                onChange={(dates) => {
                  if (dates && dates[0] && dates[1]) {
                    setStartDate(dates[0]);
                    setEndDate(dates[1]);
                  } else {
                    setStartDate(null);
                    setEndDate(null);
                  }
                }}
              />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12} md={8}>
            <Form.Item name="departmentId" style={{ marginBottom: 0 }}>
              <Cselect
                label="Phòng ban"
                options={departmentOptions}
                placeholder="Chọn phòng ban"
              />
            </Form.Item>
          </Col>
          <Col xs={24} sm={24} md={6}>
            <Form.Item style={{ marginBottom: 0 }}>
              <Cbutton
                className="filter-submit-btn"
                type="primary"
                origin={{
                  bgcolor: "#1565C0",
                  color: "#fff",
                  hoverBgColor: "#42A5F5",
                  hoverColor: "#fff",
                }}
                style={{
                  width: "100%",
                  height: "40px",
                  borderRadius: "6px",
                  fontWeight: 600,
                  background:
                    "linear-gradient(45deg, rgb(21, 101, 192), rgb(66, 165, 245))",
                  border: "none",
                }}
                icon={
                  <AiOutlineLoading3Quarters
                    size={18}
                    className="loading-icon"
                  />
                }
                onClick={() => form.submit()}
              >
                Xem thống kê
              </Cbutton>
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </div>
  );
});

Filter.displayName = "SalaryFilter";

export default Filter;
