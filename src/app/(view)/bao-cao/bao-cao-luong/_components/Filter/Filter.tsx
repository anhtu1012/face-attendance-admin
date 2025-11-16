"use client";
import Cbutton from "@/components/basicUI/Cbutton";
import CRangePicker from "@/components/basicUI/CrangePicker";
import Cselect from "@/components/Cselect";
import { useSelectData } from "@/hooks/useSelectData";
import { Col, Form, Row } from "antd";
import dayjs from "dayjs";
import { useTranslations } from "next-intl";
import { forwardRef, useImperativeHandle, useState } from "react";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { FilterProps, FilterRef, FormValues } from "../../_types/prop";
import "./Filter.scss";

const Filter = forwardRef<FilterRef, FilterProps>(({ onSubmit }, ref) => {
  const t = useTranslations("Filter");
  const [form] = Form.useForm<FormValues>();
  const { selectDepartment, selectRole } = useSelectData({
    fetchDepartment: true,
    fetchRole: true,
  });

  const [startDate, setStartDate] = useState<dayjs.Dayjs | null>(
    dayjs().startOf("month")
  );
  const [endDate, setEndDate] = useState<dayjs.Dayjs | null>(
    dayjs().endOf("month")
  );

  useImperativeHandle(ref, () => ({
    getFormValues: () => {
      const values = form.getFieldsValue();
      return values;
    },
  }));

  return (
    <Col span={24} className="filter-container">
      <Form
        form={form}
        layout="vertical"
        className="fiter-form"
        onFinish={onSubmit}
        initialValues={{
          month: [dayjs().startOf("month"), dayjs().endOf("month")],
        }}
        style={{ padding: "15px 20px" }}
      >
        <Row gutter={16} className="fiter-form-row">
          <Col span={24}>
            <Row gutter={[6, 6]}>
              <Col span={24}>
                <Form.Item name="month" style={{ width: "100%" }}>
                  <CRangePicker
                    label={["Từ ngày", "Đến ngày"]}
                    placeholder={["", ""]}
                    style={{ width: "100%", height: "36px" }}
                    format={"DD/MM/YYYY"}
                    value={startDate && endDate ? [startDate, endDate] : null}
                    onChange={(dates) => {
                      if (dates) {
                        setStartDate(dates[0]);
                        setEndDate(dates[1]);
                      }
                    }}
                  />
                </Form.Item>
              </Col>

              <Col span={24}>
                <Form.Item name="departmentId">
                  <Cselect
                    label="Phòng ban"
                    allowClear
                    options={selectDepartment}
                    placeholder="Chọn phòng ban"
                  />
                </Form.Item>
              </Col>

              <Col span={24}>
                <Form.Item name="positionId">
                  <Cselect
                    label="Chức vụ"
                    allowClear
                    options={selectRole}
                    placeholder="Chọn chức vụ"
                  />
                </Form.Item>
              </Col>
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
                <AiOutlineLoading3Quarters size={20} className="loading-icon" />
              }
              onClick={() => form.submit()}
            >
              {t("query")}
            </Cbutton>
          </Col>
        </Row>
      </Form>
    </Col>
  );
});

Filter.displayName = "Filter";

export default Filter;
