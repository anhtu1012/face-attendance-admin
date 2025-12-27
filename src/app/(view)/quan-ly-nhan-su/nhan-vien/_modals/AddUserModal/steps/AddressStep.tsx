/* eslint-disable @typescript-eslint/no-explicit-any */
import { Form, Input } from "antd";
import { EnvironmentOutlined } from "@ant-design/icons";

const { TextArea } = Input;

export function AddressStep() {
  return (
    <div className="form-step">
      <Form.Item
        name="permanentAddress"
        label="Địa chỉ thường trú"
        rules={[
          { required: true, message: "Vui lòng nhập địa chỉ thường trú!" },
          { min: 5, message: "Địa chỉ thường trú phải có ít nhất 5 ký tự!" },
        ]}
      >
        <TextArea
          placeholder="Nhập địa chỉ thường trú đầy đủ"
          size="large"
          rows={3}
        />
      </Form.Item>

      <Form.Item
        name="currentAddress"
        label="Địa chỉ hiện tại"
      >
        <TextArea
          placeholder="Nhập địa chỉ hiện tại (không bắt buộc, để trống nếu trùng với địa chỉ thường trú)"
          size="large"
          rows={3}
        />
      </Form.Item>
    </div>
  );
}
