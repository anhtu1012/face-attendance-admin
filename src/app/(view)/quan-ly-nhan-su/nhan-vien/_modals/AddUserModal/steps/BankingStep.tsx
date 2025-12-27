/* eslint-disable @typescript-eslint/no-explicit-any */
import { Form, Input, Select } from "antd";
import { BankOutlined, CreditCardOutlined, UserOutlined } from "@ant-design/icons";

const BANKS = [
  { label: "Vietcombank", value: "Vietcombank" },
  { label: "BIDV", value: "BIDV" },
  { label: "VietinBank", value: "VietinBank" },
  { label: "Agribank", value: "Agribank" },
  { label: "ACB", value: "ACB" },
  { label: "Techcombank", value: "Techcombank" },
  { label: "MBBank", value: "MBBank" },
  { label: "VPBank", value: "VPBank" },
  { label: "TPBank", value: "TPBank" },
  { label: "Sacombank", value: "Sacombank" },
  { label: "HDBank", value: "HDBank" },
  { label: "VIB", value: "VIB" },
  { label: "SHB", value: "SHB" },
  { label: "SeABank", value: "SeABank" },
  { label: "OCB", value: "OCB" },
  { label: "Eximbank", value: "Eximbank" },
  { label: "MSB", value: "MSB" },
  { label: "NCB", value: "NCB" },
  { label: "VietCapitalBank", value: "VietCapitalBank" },
  { label: "LienVietPostBank", value: "LienVietPostBank" },
  { label: "Khác", value: "Khác" },
];

export function BankingStep() {
  return (
    <div className="form-step">
      <Form.Item
        name="bankingName"
        label="Ngân hàng"
      >
        <Select
          placeholder="Chọn ngân hàng (không bắt buộc)"
          size="large"
          suffixIcon={<BankOutlined />}
          options={BANKS}
          showSearch
          optionFilterProp="label"
          allowClear
        />
      </Form.Item>

      <Form.Item
        name="bankingAccountNo"
        label="Số tài khoản"
      >
        <Input
          prefix={<CreditCardOutlined />}
          placeholder="Nhập số tài khoản ngân hàng (không bắt buộc)"
          size="large"
        />
      </Form.Item>

      <Form.Item
        name="bankingAccountName"
        label="Tên chủ tài khoản"
      >
        <Input
          prefix={<UserOutlined />}
          placeholder="Nhập tên chủ tài khoản (không bắt buộc)"
          size="large"
        />
      </Form.Item>

      <div className="info-note">
        <p>
          <strong>Lưu ý:</strong> Thông tin ngân hàng không bắt buộc và có thể cập nhật sau. 
          Đảm bảo thông tin chính xác để phục vụ cho việc chuyển lương.
        </p>
      </div>
    </div>
  );
}
