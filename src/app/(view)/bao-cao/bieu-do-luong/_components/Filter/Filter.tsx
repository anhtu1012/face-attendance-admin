"use client";
import React, { forwardRef, useImperativeHandle, useState } from "react";
import { Form, Row, Col } from "antd";
import dayjs, { Dayjs } from "dayjs";
import Cbutton from "@/components/basicUI/Cbutton";
import CdatePicker from "@/components/basicUI/CdatePicker";
import Cselect from "@/components/Cselect";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { FilterProps, SalaryFilterValues } from "../../_types/salary.types";
import "./Filter.scss";

const Filter = forwardRef<
  { getFormValues: () => Partial<SalaryFilterValues>; resetForm: () => void },
  FilterProps
>(({ onSubmit }, ref) => {
  const [form] = Form.useForm();
  const [selectedMonth, setSelectedMonth] = useState<Dayjs | null>(dayjs());

  useImperativeHandle(ref, () => ({
    getFormValues: () => {
      const values = form.getFieldsValue();
      return values;
    },
    resetForm: () => {
      form.resetFields();
      setSelectedMonth(dayjs());
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
          monthYear: dayjs(),
          departmentId: "all",
        }}
      >
        <Row gutter={16}>
          <Col xs={24} sm={12} md={10}>
            <Form.Item name="monthYear" style={{ marginBottom: 0 }}>
              <CdatePicker
                label="Chọn tháng"
                picker="month"
                style={{ width: "100%", height: "40px" }}
                format="MM/YYYY"
                value={selectedMonth}
                onChange={(date) => {
                  setSelectedMonth(date);
                  form.setFieldsValue({ monthYear: date });
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
