import React from "react";
import { Card, Form, Row, Col, DatePicker, Button, Select } from "antd";
import {
  SearchOutlined,
  ReloadOutlined,
  DownloadOutlined,
} from "@ant-design/icons";
import dayjs, { Dayjs } from "dayjs";
import "./FilterPanel.scss";

const { RangePicker } = DatePicker;

interface FilterValues {
  timeRange?: string;
  dateRange?: [Dayjs, Dayjs];
  departmentId?: string;
  roleId?: string;
  status?: string[];
}

interface FilterPanelProps {
  onFilter: (values: FilterValues) => void;
  onReset: () => void;
  onExport?: () => void;
  loading?: boolean;
  departmentOptions?: { label: string; value: string }[];
  roleOptions?: { label: string; value: string }[];
}

const FilterPanel: React.FC<FilterPanelProps> = ({
  onFilter,
  onReset,
  onExport,
  loading = false,
  departmentOptions = [],
  roleOptions = [],
}) => {
  const [form] = Form.useForm();

  const handleFilter = () => {
    form.validateFields().then((values) => {
      onFilter(values);
    });
  };

  const handleReset = () => {
    form.resetFields();
    onReset();
  };

  const timeRangeOptions = [
    { label: "Hôm nay", value: "today" },
    { label: "Tuần này", value: "week" },
    { label: "Tháng này", value: "month" },
    { label: "Quý này", value: "quarter" },
    { label: "Năm này", value: "year" },
    { label: "Tùy chỉnh", value: "custom" },
  ];

  const statusOptions = [
    { label: "Chờ liên hệ", value: "TO_CONTACT" },
    { label: "Chờ phỏng vấn", value: "TO_INTERVIEW" },
    { label: "Đã hẹn phỏng vấn", value: "INTERVIEW_SCHEDULED" },
    { label: "Đậu phỏng vấn", value: "TO_INTERVIEW_R1" },
    { label: "Thất bại phỏng vấn", value: "INTERVIEW_FAILED" },
    { label: "Chờ nhận việc", value: "JOB_OFFERED" },
    { label: "Chờ ký hợp đồng", value: "CONTRACT_SIGNING" },
    { label: "Hoàn thành", value: "HOAN_THANH" },
    { label: "Từ chối", value: "REJECTED" },
  ];

  const watchTimeRange = Form.useWatch("timeRange", form);

  return (
    <Card className="filter-panel" bordered={false}>
      <Form
        form={form}
        layout="vertical"
        initialValues={{
          timeRange: "month",
        }}
      >
        <Row gutter={16}>
          <Col xs={24} sm={12} md={6}>
            <Form.Item label="Khoảng thời gian" name="timeRange">
              <Select
                placeholder="Chọn khoảng thời gian"
                options={timeRangeOptions}
                allowClear
              />
            </Form.Item>
          </Col>

          {watchTimeRange === "custom" && (
            <Col xs={24} sm={12} md={6}>
              <Form.Item label="Từ ngày - Đến ngày" name="dateRange">
                <RangePicker
                  format="DD/MM/YYYY"
                  style={{ width: "100%" }}
                  placeholder={["Từ ngày", "Đến ngày"]}
                />
              </Form.Item>
            </Col>
          )}

          <Col xs={24} sm={12} md={6}>
            <Form.Item label="Phòng ban" name="departmentId">
              <Select
                placeholder="Chọn phòng ban"
                options={departmentOptions}
                allowClear
                showSearch
                filterOption={(input, option) =>
                  (option?.label ?? "")
                    .toLowerCase()
                    .includes(input.toLowerCase())
                }
              />
            </Form.Item>
          </Col>

          <Col xs={24} sm={12} md={6}>
            <Form.Item label="Vị trí tuyển dụng" name="roleId">
              <Select
                placeholder="Chọn vị trí"
                options={roleOptions}
                allowClear
                showSearch
                filterOption={(input, option) =>
                  (option?.label ?? "")
                    .toLowerCase()
                    .includes(input.toLowerCase())
                }
              />
            </Form.Item>
          </Col>

          <Col xs={24} sm={12} md={6}>
            <Form.Item label="Trạng thái" name="status">
              <Select
                mode="multiple"
                placeholder="Chọn trạng thái"
                options={statusOptions}
                allowClear
                maxTagCount="responsive"
              />
            </Form.Item>
          </Col>
        </Row>

        <Row justify="end" gutter={8}>
          <Col>
            <Button icon={<ReloadOutlined />} onClick={handleReset}>
              Đặt lại
            </Button>
          </Col>
          <Col>
            <Button
              type="primary"
              icon={<SearchOutlined />}
              onClick={handleFilter}
              loading={loading}
            >
              Lọc dữ liệu
            </Button>
          </Col>
          {onExport && (
            <Col>
              <Button
                icon={<DownloadOutlined />}
                onClick={onExport}
                loading={loading}
              >
                Xuất Excel
              </Button>
            </Col>
          )}
        </Row>
      </Form>
    </Card>
  );
};

export default FilterPanel;
