/* eslint-disable @typescript-eslint/no-explicit-any */
import { Modal, Form, Switch, Button, Avatar, Alert, Space, Tag } from "antd";
import {
  UserOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
} from "@ant-design/icons";
import { useState, useEffect } from "react";
import { showSuccess, showError } from "@/hooks/useNotification";
import "./UpdateAccountStatusModal.scss";

interface UpdateAccountStatusModalProps {
  open: boolean;
  onCancel: () => void;
  userData: any;
  onSuccess?: () => void;
}

/**
 * UpdateAccountStatusModal Component
 * Modal for updating user account status (active/inactive)
 */
export function UpdateAccountStatusModal({
  open,
  onCancel,
  userData,
  onSuccess,
}: UpdateAccountStatusModalProps) {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [isActive, setIsActive] = useState(true);

  useEffect(() => {
    if (open && userData) {
      const active = userData.isActive ?? true;
      setIsActive(active);
      form.setFieldsValue({
        isActive: active,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, userData]);

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);

      // TODO: Call API to update account status
      // await NguoiDungServices.updateAccountStatus(userData.id, values);

      console.log("Update account status for:", userData, values);

      showSuccess(
        values.isActive
          ? "Kích hoạt tài khoản thành công!"
          : "Vô hiệu hóa tài khoản thành công!"
      );
      form.resetFields();
      onCancel();
      onSuccess?.();
    } catch (error: any) {
      if (error.errorFields) {
        return;
      }
      showError(
        error.response?.data?.message ||
          "Cập nhật trạng thái tài khoản thất bại!"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    form.resetFields();
    onCancel();
  };

  const handleSwitchChange = (checked: boolean) => {
    setIsActive(checked);
  };

  return (
    <Modal
      title={
        <div className="modal-header-gradient">
          {isActive ? <CheckCircleOutlined /> : <CloseCircleOutlined />}
          Cập nhật trạng thái tài khoản
        </div>
      }
      open={open}
      onCancel={handleCancel}
      footer={null}
      width={550}
      className="update-account-status-modal"
      destroyOnClose
    >
      <div className="modal-content-wrapper">
        <div className="user-info-banner">
          <Avatar size={48} icon={<UserOutlined />} className="user-avatar" />
          <div className="user-info">
            <div className="user-name">
              {userData?.fullName || userData?.userName}
              <Tag color={isActive ? "green" : "red"} className="status-tag">
                {isActive ? "Hoạt động" : "Vô hiệu hóa"}
              </Tag>
            </div>
            <div className="user-detail">
              <span>{userData?.email}</span>
              {userData?.phone && <span> • {userData.phone}</span>}
            </div>
          </div>
        </div>

        <Alert
          message={
            isActive
              ? "Tài khoản này đang ở trạng thái hoạt động"
              : "Tài khoản này đang bị vô hiệu hóa"
          }
          description={
            isActive
              ? "Người dùng có thể đăng nhập và sử dụng hệ thống bình thường."
              : "Người dùng sẽ không thể đăng nhập và truy cập hệ thống."
          }
          type={isActive ? "success" : "warning"}
          showIcon
          icon={isActive ? <CheckCircleOutlined /> : <CloseCircleOutlined />}
          className="status-alert"
        />

        <Form form={form} layout="vertical" className="update-status-form">
          <Form.Item
            name="isActive"
            label="Trạng thái tài khoản"
            valuePropName="checked"
          >
            <Space direction="vertical" style={{ width: "100%" }}>
              <div className="switch-wrapper">
                <Switch
                  size="default"
                  checked={isActive}
                  onChange={handleSwitchChange}
                  checkedChildren={<CheckCircleOutlined />}
                  unCheckedChildren={<CloseCircleOutlined />}
                />
                <span className="switch-label">
                  {isActive
                    ? "Tài khoản đang hoạt động"
                    : "Tài khoản bị vô hiệu hóa"}
                </span>
              </div>
            </Space>
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
              Cập nhật
            </Button>
          </Form.Item>
        </Form>
      </div>
    </Modal>
  );
}
