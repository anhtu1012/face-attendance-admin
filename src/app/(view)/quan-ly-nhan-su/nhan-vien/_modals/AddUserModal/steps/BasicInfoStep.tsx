/* eslint-disable @typescript-eslint/no-explicit-any */
import { Form, Input, Select, DatePicker } from "antd";
import {
  UserOutlined,
  MailOutlined,
  PhoneOutlined,
  ManOutlined,
  WomanOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";

interface BasicInfoStepProps {
  mode?: "add" | "update";
}

export function BasicInfoStep({ mode = "add" }: BasicInfoStepProps) {
  return (
    <div className="form-step">
      <Form.Item
        name="userName"
        label="Tên đăng nhập"
        rules={[
          { required: true, message: "Vui lòng nhập tên đăng nhập!" },
          { min: 3, message: "Tên đăng nhập phải có ít nhất 3 ký tự!" },
          { max: 50, message: "Tên đăng nhập không được quá 50 ký tự!" },
          {
            pattern: /^[a-zA-Z0-9_]+$/,
            message: "Tên đăng nhập chỉ được chứa chữ cái, số và dấu gạch dưới!",
          },
        ]}
      >
        <Input
          prefix={<UserOutlined />}
          placeholder="Nhập tên đăng nhập"
          size="large"
          disabled={mode === "update"}
        />
      </Form.Item>

      <Form.Item
        name="fullName"
        label="Họ và tên"
        rules={[
          { required: true, message: "Vui lòng nhập họ và tên!" },
          { min: 2, message: "Họ và tên phải có ít nhất 2 ký tự!" },
          { max: 100, message: "Họ và tên không được quá 100 ký tự!" },
        ]}
      >
        <Input
          prefix={<UserOutlined />}
          placeholder="Nhập họ và tên đầy đủ"
          size="large"
        />
      </Form.Item>

      <div className="form-row">
        <Form.Item
          name="email"
          label="Email"
          rules={[
            { required: true, message: "Vui lòng nhập email!" },
            { type: "email", message: "Email không hợp lệ!" },
          ]}
          style={{ flex: 1 }}
        >
          <Input
            prefix={<MailOutlined />}
            placeholder="email@example.com"
            size="large"
          />
        </Form.Item>

        <Form.Item
          name="phone"
          label="Số điện thoại"
          rules={[
            { required: true, message: "Vui lòng nhập số điện thoại!" },
            {
              pattern: /^0\d{9}$/,
              message: "Số điện thoại phải có 10 chữ số và bắt đầu bằng số 0!",
            },
          ]}
          style={{ flex: 1 }}
        >
          <Input
            prefix={<PhoneOutlined />}
            placeholder="0xxxxxxxxx"
            size="large"
            maxLength={10}
          />
        </Form.Item>
      </div>

      <div className="form-row">
        <Form.Item
          name="gender"
          label="Giới tính"
          rules={[{ required: true, message: "Vui lòng chọn giới tính!" }]}
          style={{ flex: 1 }}
        >
          <Select placeholder="Chọn giới tính" size="large">
            <Select.Option value="M">
              <ManOutlined /> Nam
            </Select.Option>
            <Select.Option value="F">
              <WomanOutlined /> Nữ
            </Select.Option>
          </Select>
        </Form.Item>

        <Form.Item
          name="birthday"
          label="Ngày sinh"
          rules={[
            { required: true, message: "Vui lòng chọn ngày sinh!" },
            {
              validator: (_, value) => {
                if (!value) return Promise.resolve();
                
                // value is already a dayjs object from DatePicker
                const age = dayjs().diff(value, "year");
                if (age < 18) {
                  return Promise.reject(new Error("Tuổi phải từ 18 trở lên!"));
                }
                if (age > 65) {
                  return Promise.reject(new Error("Tuổi không được quá 65!"));
                }
                return Promise.resolve();
              },
            },
          ]}
          style={{ flex: 1 }}
        >
          <DatePicker
            placeholder="Chọn ngày sinh"
            size="large"
            style={{ width: "100%" }}
            format="DD/MM/YYYY"
            disabledDate={(current) => {
              return current && current > dayjs().endOf("day");
            }}
          />
        </Form.Item>
      </div>
    </div>
  );
}
