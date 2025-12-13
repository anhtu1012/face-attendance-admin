/* eslint-disable @typescript-eslint/no-explicit-any */
import { Modal, Form, Input, Button } from "antd";
import { LockOutlined } from "@ant-design/icons";
import { useState } from "react";
import { showSuccess, showError } from "@/hooks/useNotification";
import "./ChangePasswordModal.scss";
import AuthServices from "@/services/auth/api.service";

interface ChangePasswordModalProps {
  open: boolean;
  onCancel: () => void;
  userData: any;
  onSuccess?: () => void;
}

export function ChangePasswordModal({
  open,
  onCancel,
  userData,
  onSuccess,
}: ChangePasswordModalProps) {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);
      await AuthServices.forgotPassword(userData.id, values.newPassword);
      showSuccess("Đổi mật khẩu thành công!");
      form.resetFields();
      onCancel();
      onSuccess?.();
    } catch (error: any) {
      if (error.errorFields) {
        return;
      }
      showError(error.response?.data?.message || "Đổi mật khẩu thất bại!");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    form.resetFields();
    onCancel();
  };

  return (
    <Modal
      title={
        <div className="modal-header-gradient">
          <LockOutlined /> Đổi mật khẩu
        </div>
      }
      open={open}
      onCancel={handleCancel}
      footer={null}
      width={500}
      className="change-password-modal"
      destroyOnClose
    >
      <div className="modal-content-wrapper">
        <div className="user-info-banner">
          <div className="user-info">
            <div className="user-name">
              {userData?.fullName || userData?.userName}
            </div>
            <div className="user-email">{userData?.email}</div>
          </div>
        </div>

        <Form form={form} layout="vertical" className="change-password-form">
          <Form.Item
            name="newPassword"
            label="Mật khẩu mới"
            rules={[
              { required: true, message: "Vui lòng nhập mật khẩu mới!" },
              { min: 6, message: "Mật khẩu phải có ít nhất 6 ký tự!" },
            ]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="Nhập mật khẩu mới"
              size="large"
            />
          </Form.Item>

          <Form.Item
            name="confirmPassword"
            label="Xác nhận mật khẩu"
            dependencies={["newPassword"]}
            rules={[
              { required: true, message: "Vui lòng xác nhận mật khẩu!" },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue("newPassword") === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(
                    new Error("Mật khẩu xác nhận không khớp!")
                  );
                },
              }),
            ]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="Xác nhận mật khẩu mới"
              size="large"
            />
          </Form.Item>

          <Form.Item className="form-actions">
            <Button onClick={handleCancel} size="large">
              Hủy
            </Button>
            <Button
              type="primary"
              onClick={handleOk}
              loading={loading}
              size="large"
              className="gradient-button"
            >
              Đổi mật khẩu
            </Button>
          </Form.Item>
        </Form>
      </div>
    </Modal>
  );
}
