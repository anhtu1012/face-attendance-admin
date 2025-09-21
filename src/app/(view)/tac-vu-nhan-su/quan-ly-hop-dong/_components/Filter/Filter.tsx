/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import Cbutton from "@/components/basicUI/Cbutton";
import CRangePicker from "@/components/basicUI/CrangePicker";
import Cselect from "@/components/Cselect";
import { showWarning } from "@/hooks/useNotification";
import { FilterOperationType } from "@chax-at/prisma-filter-common";
import { Col, Form, Row } from "antd";
import dayjs from "dayjs";
import { useTranslations } from "next-intl";
import { forwardRef, useImperativeHandle, useState } from "react";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import "./index.scss";
import { FilterProps, FilterRef } from "../../_types/prop";
// Add ref type

const Filter = forwardRef<FilterRef, FilterProps>(
  ({ disabled = false }, ref) => {
    const t = useTranslations("Filter");
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [startDate, setStartDate] = useState<dayjs.Dayjs | null>(
      dayjs().startOf("day")
    );
    const [endDate, setEndDate] = useState<dayjs.Dayjs | null>(
      dayjs().endOf("day")
    );

    // Handle form submission
    const handleFinish = async (values: any) => {
      try {
        setLoading(true);
        const searchFilter: any = [];
        const { role } = values;
        if (role) {
          searchFilter.push({
            key: "role",
            type: FilterOperationType.Eq,
            value: role,
          });
        }
        // Add date range filter
        if (startDate && endDate) {
          searchFilter.push({
            key: "fromDate",
            type: FilterOperationType.Eq,
            value: startDate.format("YYYY-MM-DD HH:mm:ss"),
          });
          searchFilter.push({
            key: "toDate",
            type: FilterOperationType.Eq,
            value: endDate.format("YYYY-MM-DD HH:mm:ss"),
          });
        }
      } catch (error: any) {
        console.error("Error fetching container data:", error);
        showWarning(
          error.response?.data?.message ||
            error.message ||
            "Có lỗi xảy ra khi tìm kiếm dữ liệu!"
        );
      } finally {
        setLoading(false);
      }
    };

    // Expose form methods through ref
    useImperativeHandle(ref, () => ({
      submitForm: () => {
        form.submit();
      },
      getFormValues: () => {
        return form.getFieldsValue();
      },
      validateForm: async () => {
        try {
          await form.validateFields();
          return true;
        } catch (error: any) {
          console.log("Form validation error:", error);
          return false;
        }
      },
      resetForm: () => {
        form.resetFields();
      },
      handleCreateNewOrder: () => {
        form.resetFields();
        setStartDate(dayjs().startOf("day"));
        setEndDate(dayjs().endOf("day"));
      },
    }));

    return (
      <>
        <Form
          form={form}
          layout="vertical"
          className="fiter-form"
          disabled={disabled}
          onFinish={handleFinish}
          initialValues={{
            filterDateRange: [dayjs().startOf("day"), dayjs().endOf("day")],
          }}
        >
          {/* Layout */}
          <Row gutter={16} className="fiter-form-row">
            {/* Col 1 */}
            <Col span={24}>
              {/* Col 2 */}
              <Row gutter={6}>
                <>
                  <Col span={24}>
                    <Form.Item name="filterDateRange" style={{ width: "100%" }}>
                      <CRangePicker
                        label={[t("fromDate"), t("toDate")]}
                        placeholder={["", ""]}
                        style={{ width: "100%", height: "36px" }}
                        format={"DD/MM/YYYY HH:mm:ss"}
                        value={
                          startDate && endDate ? [startDate, endDate] : null
                        }
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
                  <Col span={24}>
                    <Form.Item name="role">
                      <Cselect
                        label="Role"
                        allowClear
                        defaultValue="nh"
                        options={[
                          { label: "Nhân viên", value: "nh" },
                          { label: "Quản lý", value: "ql" },
                          { label: "Giám đốc", value: "gd" },
                        ]}
                      />
                    </Form.Item>
                  </Col>
                </>
              </Row>
            </Col>
            <Col span={24} style={{ textAlign: "center", marginTop: "5px" }}>
              <Cbutton
                className="query-btn"
                type="primary"
                origin={{
                  bgcolor: "white",
                  color: "#07732bff",
                  hoverBgColor: "#07732bff",
                  hoverColor: "#fff",
                  border: "1px solid #07732bff",
                }}
                style={{
                  padding: "12px",
                  borderRadius: "4px",
                  height: "36px",
                  fontWeight: "bold",
                }}
                icon={
                  <AiOutlineLoading3Quarters
                    size={20}
                    className="loading-icon"
                  />
                }
                htmlType="submit"
                loading={loading}
              >
                {t("query")}
              </Cbutton>
            </Col>
          </Row>
        </Form>
      </>
    );
  }
);

Filter.displayName = "Filter";
export default Filter;
