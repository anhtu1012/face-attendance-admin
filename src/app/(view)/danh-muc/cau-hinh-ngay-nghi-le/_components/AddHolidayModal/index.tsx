// Add Holiday Modal Component
import Cbutton from "@/components/basicUI/Cbutton";
import { DatePicker, Form, Input, Modal } from "antd";
import type { Dayjs } from "dayjs";
import React from "react";
import "./AddHolidayModal.scss";

interface AddHolidayModalProps {
  visible: boolean;
  onCancel: () => void;
  onSubmit: (values: HolidayFormValues) => void;
  initialDate?: Dayjs | null;
  loading?: boolean;
}

export interface HolidayFormValues {
  date: Dayjs;
  name: string;
  description?: string;
  isRecurring?: boolean;
}

const AddHolidayModal: React.FC<AddHolidayModalProps> = ({
  visible,
  onCancel,
  onSubmit,
  initialDate,
  loading = false,
}) => {
  const [form] = Form.useForm<HolidayFormValues>();

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      onSubmit(values);
      form.resetFields();
    } catch (error) {
      console.error("Validation failed:", error);
    }
  };

  const handleCancel = () => {
    form.resetFields();
    onCancel();
  };

  React.useEffect(() => {
    if (visible && initialDate) {
      form.setFieldsValue({ date: initialDate });
    }
  }, [visible, initialDate, form]);

  return (
    <Modal
      title="Thêm ngày nghỉ lễ"
      open={visible}
      onCancel={handleCancel}
      className="add-holiday-modal"
      width={520}
      footer={[
        <Cbutton
          key="cancel"
          onClick={handleCancel}
          disabled={loading}
          style={{ marginRight: "5px" }}
        >
          Hủy
        </Cbutton>,
        <Cbutton
          key="submit"
          customVariant="primary"
          onClick={handleOk}
          disabled={loading}
        >
          Thêm
        </Cbutton>,
      ]}
    >
      <Form
        form={form}
        layout="vertical"
        className="holiday-form"
        initialValues={{ date: initialDate }}
      >
        <Form.Item
          name="date"
          label="Ngày nghỉ lễ"
          rules={[{ required: true, message: "Vui lòng chọn ngày!" }]}
        >
          <DatePicker
            style={{ width: "100%" }}
            format="DD/MM/YYYY"
            placeholder="Chọn ngày nghỉ lễ"
            size="large"
            className="custom-datepicker"
          />
        </Form.Item>

        <Form.Item
          name="name"
          label="Tên ngày nghỉ lễ"
          rules={[{ required: true, message: "Vui lòng nhập tên!" }]}
        >
          <Input
            placeholder="VD: Ngày nghỉ công ty"
            size="large"
            className="custom-input"
          />
        </Form.Item>

        <Form.Item name="description" label="Mô tả">
          <Input.TextArea
            rows={3}
            placeholder="Mô tả chi tiết về ngày nghỉ lễ"
            className="custom-textarea"
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default AddHolidayModal;
