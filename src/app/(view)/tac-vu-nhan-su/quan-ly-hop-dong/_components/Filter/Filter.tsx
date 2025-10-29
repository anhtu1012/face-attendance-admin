/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import Cbutton from "@/components/basicUI/Cbutton";
import CInputLabel from "@/components/basicUI/CInputLabel";
import CRangePicker from "@/components/basicUI/CrangePicker";
import Cselect from "@/components/Cselect";
import { useSelectData } from "@/hooks/useSelectData";
import { Col, Form, Row } from "antd";
import dayjs from "dayjs";
import { useTranslations } from "next-intl";
import { forwardRef, useImperativeHandle, useState } from "react";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { FaRegUserCircle } from "react-icons/fa";
import { FilterProps, FilterRef, FormValues } from "../../_types/prop";
import "./index.scss";
// Add ref type

const Filter = forwardRef<FilterRef, FilterProps>(
  ({ disabled = false, onSubmit }, ref) => {
    const t = useTranslations("Filter");
    const [form] = Form.useForm<FormValues>();
    const {
      selectRole,
      selectContractType,
      selectDepartment,
      selectStatusContract,
    } = useSelectData({
      fetchRole: true,
      fetchDepartment: true,
      fetchContractType: true,
    });
    const [startDate, setStartDate] = useState<dayjs.Dayjs | null>(
      dayjs().startOf("day")
    );
    const [endDate, setEndDate] = useState<dayjs.Dayjs | null>(
      dayjs().endOf("day")
    );

    // Handle form submission
    const handleFinish = async () => {
      onSubmit?.();
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
          style={{ padding: "15px 20px" }}
        >
          {/* Layout */}
          <Row gutter={16} className="fiter-form-row">
            {/* Col 1 */}
            <Col span={24}>
              {/* Col 2 */}
              <Row gutter={[6, 6]}>
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
                        label="Vai trò"
                        allowClear
                        options={selectRole}
                      />
                    </Form.Item>
                  </Col>
                  <Col span={24}>
                    <Form.Item name="department">
                      <Cselect
                        label="Phòng ban"
                        allowClear
                        options={selectDepartment}
                      />
                    </Form.Item>
                  </Col>
                  <Col span={24}>
                    <Form.Item name="userName">
                      <CInputLabel
                        label="Tên nhân viên"
                        allowClear
                        suffix={
                          <>
                            <FaRegUserCircle />
                          </>
                        }
                      />
                    </Form.Item>
                  </Col>
                  <Col span={24}>
                    <Form.Item name="contractType">
                      <Cselect
                        label="Loại hợp đồng"
                        allowClear
                        options={selectContractType}
                      />
                    </Form.Item>
                  </Col>
                  <Col span={24}>
                    <Form.Item name="status">
                      <Cselect
                        label="Trang thái"
                        allowClear
                        options={selectStatusContract}
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
                onClick={() => form.submit()}
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
