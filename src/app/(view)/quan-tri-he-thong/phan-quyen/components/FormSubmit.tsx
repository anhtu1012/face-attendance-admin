import CRoleSelect from "@/components/basicUI/cApiSelect/RoleSelect";
import { Button, Col, Form, Row } from "antd";
import { useTranslations } from "next-intl";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { TiTick } from "react-icons/ti";
import "./index.scss";

interface FormSubmitProps {
  onRoleChange: (roleId: string) => void;
  onAllPermissionToggle: () => void;
  allPermissionsSelected: boolean;
}

function FormSubmit({
  onRoleChange,
  onAllPermissionToggle,
  allPermissionsSelected,
}: FormSubmitProps) {
  const [form] = Form.useForm();
  const t = useTranslations("PhanQuyen");

  const handleSelectRole = (roleId: string) => {
    form.setFieldValue("roleId", roleId);
  };

  const onFinish = () => {
    const roleId = form.getFieldValue("roleId");
    onRoleChange(roleId || "");
  };

  return (
    <Form
      form={form}
      onFinish={onFinish}
      className="from-quey"
      layout="vertical"
    >
      <div className="permission-form-container">
        <Row gutter={12} className="row-container">
          <Col span={4} className="gutter-row">
            <Form.Item name="roleId">
              <CRoleSelect
                onSelectRole={handleSelectRole}
                label={t("pickAccountGroup")}
                style={{
                  width: "100%",
                  height: "36px",
                }}
              />
            </Form.Item>
          </Col>
          <Col
            span={18}
            className="gutter-row"
            style={{ display: "flex", justifyContent: "flex-end" }}
          >
            <Button
              onClick={onAllPermissionToggle}
              className="btn-permission"
              type="default"
              style={{
                padding: "18px",
                border: allPermissionsSelected
                  ? "1px solid #ff4d4f"
                  : "1px solid rgb(93, 201, 239)",
                borderRadius: "4px",
                fontWeight: "bold",
                backgroundColor: "white",
                color: allPermissionsSelected ? "#ff4d4f" : "rgb(93, 201, 239)",
                whiteSpace: "nowrap",
                flexShrink: 0,
              }}
            >
              <TiTick size={20} />
              {allPermissionsSelected
                ? t("unPermissionAll")
                : t("permissionAll")}
            </Button>
          </Col>
          <Col
            span={2}
            className="gutter-row"
            style={{ display: "flex", justifyContent: "flex-end" }}
          >
            <Button
              htmlType="submit"
              className="btn-query"
              type="default"
              style={{
                padding: "18px",
                border: "1px solid #EFB008",
                borderRadius: "4px",
                fontWeight: "bold",
                backgroundColor: "white",
                color: "#EFB008",
                whiteSpace: "nowrap",
                flexShrink: 0,
              }}
            >
              <AiOutlineLoading3Quarters size={20} /> {t("truyvan")}
            </Button>
          </Col>
        </Row>
      </div>
    </Form>
  );
}

export default FormSubmit;
