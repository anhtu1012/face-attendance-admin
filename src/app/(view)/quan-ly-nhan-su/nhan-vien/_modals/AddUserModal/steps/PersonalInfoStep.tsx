/* eslint-disable @typescript-eslint/no-explicit-any */
import { Form, Input, Select } from "antd";
import { GlobalOutlined, HeartOutlined } from "@ant-design/icons";

const MARITAL_STATUS = [
  { label: "Độc thân", value: "Độc thân" },
  { label: "Đã kết hôn", value: "Đã kết hôn" },
  { label: "Ly hôn", value: "Ly hôn" },
];

const MILITARY_STATUS = [
  { label: "Đã hoàn thành nghĩa vụ quân sự", value: "Đã hoàn thành nghĩa vụ quân sự" },
  { label: "Chưa hoàn thành nghĩa vụ quân sự", value: "Chưa hoàn thành nghĩa vụ quân sự" },
  { label: "Miễn nghĩa vụ quân sự", value: "Miễn nghĩa vụ quân sự" },
];

const NATIONS = [
  { label: "Kinh", value: "Kinh" },
  { label: "Tày", value: "Tày" },
  { label: "Thái", value: "Thái" },
  { label: "Mường", value: "Mường" },
  { label: "Khmer", value: "Khmer" },
  { label: "Hoa", value: "Hoa" },
  { label: "Nùng", value: "Nùng" },
  { label: "H'Mông", value: "H'Mông" },
  { label: "Dao", value: "Dao" },
  { label: "Gia Rai", value: "Gia Rai" },
  { label: "Khác", value: "Khác" },
];

export function PersonalInfoStep() {
  return (
    <div className="form-step">
      <div className="form-row">
        <Form.Item
          name="nation"
          label="Dân tộc"
          style={{ flex: 1 }}
        >
          <Select
            placeholder="Chọn dân tộc"
            size="large"
            options={NATIONS}
            showSearch
            optionFilterProp="label"
            allowClear
          />
        </Form.Item>

        <Form.Item
          name="nationality"
          label="Quốc tịch"
          style={{ flex: 1 }}
        >
          <Input
            prefix={<GlobalOutlined />}
            placeholder="Nhập quốc tịch"
            size="large"
          />
        </Form.Item>
      </div>

      <div className="form-row">
        <Form.Item
          name="marriedStatus"
          label="Tình trạng hôn nhân"
          style={{ flex: 1 }}
        >
          <Select
            placeholder="Chọn tình trạng hôn nhân"
            size="large"
            suffixIcon={<HeartOutlined />}
            options={MARITAL_STATUS}
            allowClear
          />
        </Form.Item>

        <Form.Item
          name="militaryStatus"
          label="Tình trạng nghĩa vụ quân sự"
          style={{ flex: 1 }}
        >
          <Select
            placeholder="Chọn tình trạng nghĩa vụ quân sự"
            size="large"
            options={MILITARY_STATUS}
            allowClear
          />
        </Form.Item>
      </div>
    </div>
  );
}
