import Cselect from "@/components/Cselect";
import Cbutton from "@/components/basicUI/Cbutton";
import { SelectOption } from "@/dtos/select/select.dto";
import SelectServices from "@/services/select/select.service";
import { Card, Col, Form, Row } from "antd";
import React, { useState } from "react";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import "./FilterPanel.scss";
import { useSelectData } from "@/hooks/useSelectData";

interface FilterValues {
  departmentId?: string;
  positionId?: string;
  status?: string;
  gender?: string;
}

interface FilterPanelProps {
  onFilter: (values: FilterValues) => void;
  onReset: () => void;
  loading?: boolean;
  departmentOptions?: { label: string; value: string }[];
}

const FilterPanel: React.FC<FilterPanelProps> = ({
  onFilter,
  loading = false,
  departmentOptions = [],
}) => {
  const [form] = Form.useForm();
  const [positionOptions, setPositionOptions] = useState<SelectOption[]>([]);
  const [loadingPosition, setLoadingPosition] = useState(false);
  const { selectLevelSalary } = useSelectData({ fetchLevelSalary: true });

  // Fetch positions when department changes
  const handleDepartmentChange = async (departmentId: string | undefined) => {
    // Reset position when department changes
    form.setFieldsValue({ positionId: undefined });
    setPositionOptions([]);

    if (!departmentId) return;

    setLoadingPosition(true);
    try {
      const response =
        await SelectServices.getSelectPositionWithRoleAndDepartment(
          departmentId
        );
      setPositionOptions(response.data || []);
    } catch (error) {
      console.error("Error fetching positions:", error);
      setPositionOptions([]);
    } finally {
      setLoadingPosition(false);
    }
  };

  const handleFilter = () => {
    const values = form.getFieldsValue();
    onFilter(values);
  };

  const genderOptions = [
    { label: "Nam", value: "male" },
    { label: "Nữ", value: "female" },
    { label: "Khác", value: "other" },
  ];

  return (
    <Card
      className="employee-filter-panel"
      style={{ padding: "15px 20px" }}
      bordered={false}
    >
      <Form form={form} layout="vertical">
        <Row gutter={[6, 6]}>
          <Col span={24}>
            <Form.Item name="departmentId" style={{ marginBottom: "10px" }}>
              <Cselect
                label="Phòng ban"
                allowClear
                options={departmentOptions}
                onChange={handleDepartmentChange}
              />
            </Form.Item>
          </Col>

          <Col span={24}>
            <Form.Item name="positionId" style={{ marginBottom: "10px" }}>
              <Cselect
                label="Chức vụ"
                allowClear
                options={positionOptions}
                disabled={positionOptions.length === 0 && !loadingPosition}
              />
            </Form.Item>
          </Col>

          <Col span={24}>
            <Form.Item name="levelSalaryId" style={{ marginBottom: "10px" }}>
              <Cselect
                label="Cấp bậc lương"
                allowClear
                options={selectLevelSalary}
              />
            </Form.Item>
          </Col>

          <Col span={24}>
            <Form.Item name="gender" style={{ marginBottom: "10px" }}>
              <Cselect label="Giới tính" allowClear options={genderOptions} />
            </Form.Item>
          </Col>

          <Col span={24} style={{ textAlign: "center", marginTop: "5px" }}>
            <Cbutton
              className="query-btn"
              type="primary"
              origin={{
                bgcolor: "white",
                color: "#003c97",
                hoverBgColor: "#003c97",
                hoverColor: "#fff",
                border: "1px solid #003c97",
              }}
              style={{
                padding: "12px",
                borderRadius: "4px",
                height: "36px",
                fontWeight: "bold",
                width: "100%",
              }}
              icon={<AiOutlineLoading3Quarters size={20} />}
              onClick={handleFilter}
              loading={loading}
            >
              Lọc dữ liệu
            </Cbutton>
          </Col>
        </Row>
      </Form>
    </Card>
  );
};

export default FilterPanel;
