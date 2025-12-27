/* eslint-disable @typescript-eslint/no-explicit-any */
import { Form, Input, DatePicker } from "antd";
import { IdcardOutlined, NumberOutlined } from "@ant-design/icons";
import dayjs from "dayjs";

export function IdentityStep() {
  return (
    <div className="form-step">
      <Form.Item
        name="citizenIdentityCard"
        label="Số CMND/CCCD"
        rules={[
          { required: true, message: "Vui lòng nhập số CMND/CCCD!" },
          {
            pattern: /^\d{12}$/,
            message: "Số CMND/CCCD phải có 12 chữ số!",
          },
        ]}
      >
        <Input
          prefix={<IdcardOutlined />}
          placeholder="Nhập số CMND/CCCD (12 chữ số)"
          size="large"
          maxLength={12}
        />
      </Form.Item>

      <div className="form-row">
        <Form.Item
          name="issueDate"
          label="Ngày cấp"
          rules={[
            { required: true, message: "Vui lòng chọn ngày cấp!" },
            {
              validator: (_, value) => {
                if (!value) return Promise.resolve();
                
                // value is already a dayjs object from DatePicker
                if (value.isAfter(dayjs())) {
                  return Promise.reject(
                    new Error("Ngày cấp không được sau ngày hiện tại!")
                  );
                }
                return Promise.resolve();
              },
            },
          ]}
          style={{ flex: 1 }}
        >
          <DatePicker
            placeholder="Chọn ngày cấp"
            size="large"
            style={{ width: "100%" }}
            format="DD/MM/YYYY"
            disabledDate={(current) => {
              return current && current > dayjs().endOf("day");
            }}
          />
        </Form.Item>

        <Form.Item
          name="issueAt"
          label="Nơi cấp"
          rules={[{ required: true, message: "Vui lòng nhập nơi cấp!" }]}
          style={{ flex: 1 }}
        >
          <Input placeholder="Nhập nơi cấp" size="large" />
        </Form.Item>
      </div>

      {/* <Form.Item
        name="taxCode"
        label="Mã số thuế"
        rules={[
          {
            pattern: /^\d{10,13}$/,
            message: "Mã số thuế phải có từ 10-13 chữ số!",
          },
        ]}
      >
        <Input
          prefix={<NumberOutlined />}
          placeholder="Nhập mã số thuế (không bắt buộc)"
          size="large"
          maxLength={13}
        />
      </Form.Item> */}
    </div>
  );
}
