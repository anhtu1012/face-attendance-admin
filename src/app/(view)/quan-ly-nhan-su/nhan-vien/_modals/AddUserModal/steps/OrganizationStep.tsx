/* eslint-disable @typescript-eslint/no-explicit-any */
import { Form, Select } from "antd";
import {
  TeamOutlined,
  BankOutlined,
  UserSwitchOutlined,
  CrownOutlined,
  DollarOutlined,
} from "@ant-design/icons";
import { useSelectData } from "@/hooks/useSelectData";
import { useState, useEffect } from "react";
import SelectServices from "@/services/select/select.service";

export function OrganizationStep() {
  const { selectRole, selectDepartment, selectLevelSalary } = useSelectData({
    fetchRole: true,
    fetchDepartment: true,
    fetchLevelSalary: true,
  });

  const [positions, setPositions] = useState<any[]>([]);
  const [managers, setManagers] = useState<any[]>([]);
  const [selectedDepartment, setSelectedDepartment] = useState<string>();
  const [selectedRole, setSelectedRole] = useState<string>();

  // Fetch positions when department changes
  useEffect(() => {
    if (selectedDepartment) {
      SelectServices.getSelectPositionWithRoleAndDepartment(selectedDepartment)
        .then((res) => {
          setPositions(res.data || []);
        })
        .catch((err) => {
          console.error("Error fetching positions:", err);
          setPositions([]);
        });
    } else {
      setPositions([]);
    }
  }, [selectedDepartment]);

  // Fetch managers when role and department change
  useEffect(() => {
    if (selectedRole && selectedDepartment) {
      SelectServices.getSelectManagerUser(selectedRole, selectedDepartment)
        .then((res) => {
          setManagers(res.data || []);
        })
        .catch((err) => {
          console.error("Error fetching managers:", err);
          setManagers([]);
        });
    } else {
      setManagers([]);
    }
  }, [selectedRole, selectedDepartment]);

  return (
    <div className="form-step">
      <div className="form-row">
        <Form.Item
          name="roleId"
          label="Vai trò"
          rules={[{ required: true, message: "Vui lòng chọn vai trò!" }]}
          style={{ flex: 1 }}
        >
          <Select
            placeholder="Chọn vai trò"
            size="large"
            suffixIcon={<CrownOutlined />}
            options={selectRole}
            onChange={(value) => setSelectedRole(value)}
            showSearch
            optionFilterProp="label"
          />
        </Form.Item>

        <Form.Item
          name="departmentId"
          label="Phòng ban"
          rules={[{ required: true, message: "Vui lòng chọn phòng ban!" }]}
          style={{ flex: 1 }}
        >
          <Select
            placeholder="Chọn phòng ban"
            size="large"
            suffixIcon={<BankOutlined />}
            options={selectDepartment}
            onChange={(value) => setSelectedDepartment(value)}
            showSearch
            optionFilterProp="label"
          />
        </Form.Item>
      </div>

      <Form.Item name="manageByUserId" label="Quản lý trực tiếp">
        <Select
          placeholder="Chọn quản lý trực tiếp (không bắt buộc)"
          size="large"
          suffixIcon={<UserSwitchOutlined />}
          options={managers}
          disabled={!selectedRole || !selectedDepartment}
          showSearch
          optionFilterProp="label"
          allowClear
        />
      </Form.Item>
    </div>
  );
}
