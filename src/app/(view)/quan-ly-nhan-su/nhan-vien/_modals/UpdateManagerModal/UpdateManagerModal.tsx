/* eslint-disable @typescript-eslint/no-explicit-any */
import { SelectOption } from "@/dtos/select/select.dto";
import { showError, showSuccess } from "@/hooks/useNotification";
import QlNguoiDungServices from "@/services/admin/quan-li-nguoi-dung/quan-li-nguoi-dung.service";
import SelectServices from "@/services/select/select.service";
import { TeamOutlined, UserOutlined } from "@ant-design/icons";
import { Avatar, Button, Form, Modal, Select } from "antd";
import { useEffect, useState } from "react";
import "./UpdateManagerModal.scss";

interface UpdateManagerModalProps {
  open: boolean;
  onCancel: () => void;
  userData: any;
  onSuccess?: () => void;
}

/**
 * UpdateManagerModal Component
 * Modal for updating user's manager
 */
export function UpdateManagerModal({
  open,
  onCancel,
  userData,
  onSuccess,
}: UpdateManagerModalProps) {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [managersSelect, setManagersSelect] = useState<SelectOption[]>([]);
  const [loadingManagers, setLoadingManagers] = useState(false);

  useEffect(() => {
    if (open) {
      fetchManagers();
      form.setFieldsValue({
        managerId: userData?.managerId,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, userData]);

  const fetchManagers = async () => {
    setLoadingManagers(true);
    console.log("userData", userData);

    try {
      const res = await SelectServices.getSelectManagerUser(
        userData.roleId,
        userData.departmentId
      );

      setManagersSelect(res.data || []);
    } catch (error: any) {
      showError(
        error.response?.data?.message || "Lỗi khi tải danh sách người quản lý!"
      );
    } finally {
      setLoadingManagers(false);
    }
  };

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);
      await QlNguoiDungServices.updateUserManager({
        userId: userData.id,
        managedByUserId: values.managerId,
      });
      showSuccess("Cập nhật người quản lý thành công!");
      form.resetFields();
      onCancel();
      onSuccess?.();
    } catch (error: any) {
      if (error.errorFields) {
        return;
      }
      showError(
        error.response?.data?.message || "Cập nhật người quản lý thất bại!"
      );
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
          <TeamOutlined /> Cập nhật người quản lý
        </div>
      }
      open={open}
      onCancel={handleCancel}
      footer={null}
      width={600}
      className="update-manager-modal"
      destroyOnClose
    >
      <div className="modal-content-wrapper">
        <div className="user-info-banner">
          <Avatar size={48} icon={<UserOutlined />} className="user-avatar" />
          <div className="user-info">
            <div className="user-name">
              {userData?.fullName || userData?.userName}
            </div>
            <div className="user-detail">
              <span>{userData?.email}</span>
              {userData?.phone && <span> • {userData.phone}</span>}
            </div>
          </div>
        </div>

        <Form form={form} layout="vertical" className="update-manager-form">
          <Form.Item
            name="managerId"
            label="Chọn người quản lý"
            rules={[
              { required: true, message: "Vui lòng chọn người quản lý!" },
            ]}
          >
            <Select
              size="large"
              placeholder="Chọn người quản lý"
              loading={loadingManagers}
              showSearch
              optionFilterProp="children"
              filterOption={(input, option) =>
                (option?.label ?? "")
                  .toLowerCase()
                  .includes(input.toLowerCase())
              }
              options={managersSelect}
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
              Cập nhật
            </Button>
          </Form.Item>
        </Form>
      </div>
    </Modal>
  );
}
