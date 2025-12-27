/* eslint-disable @typescript-eslint/no-explicit-any */
import { Modal, Steps, Button, Form } from "antd";
import { UserAddOutlined } from "@ant-design/icons";
import { useUserForm } from "../../_hooks/useUserForm";
import { UserFormStep } from "../../_types/user-form.types";
import {
  BasicInfoStep,
  OrganizationStep,
  PersonalInfoStep,
  IdentityStep,
  AddressStep,
  BankingStep,
} from "./steps";
import "./AddUserModal.scss";

interface AddUserModalProps {
  open: boolean;
  onCancel: () => void;
  onSuccess?: () => void;
}

export function AddUserModal({ open, onCancel, onSuccess }: AddUserModalProps) {
  const { form, currentStep, loading, nextStep, prevStep, goToStep, handleSubmit, handleCancel } =
    useUserForm({
      mode: "add",
      onSuccess,
      onCancel,
    });

  const steps = [
    {
      title: "Thông tin cơ bản",
      content: <BasicInfoStep />,
    },
    {
      title: "Tổ chức",
      content: <OrganizationStep />,
    },
    {
      title: "Thông tin cá nhân",
      content: <PersonalInfoStep />,
    },
    {
      title: "Giấy tờ tùy thân",
      content: <IdentityStep />,
    },
    {
      title: "Địa chỉ",
      content: <AddressStep />,
    },
    {
      title: "Ngân hàng",
      content: <BankingStep />,
    },
  ];

  const isLastStep = currentStep === UserFormStep.BANKING;
  const isFirstStep = currentStep === UserFormStep.BASIC_INFO;

  return (
    <Modal
      title={
        <div className="modal-header-gradient">
          <UserAddOutlined /> Thêm nhân viên mới
        </div>
      }
      open={open}
      onCancel={handleCancel}
      footer={null}
      width={900}
      className="add-user-modal"
      destroyOnClose
    >
      <div className="modal-content-wrapper">
        <Steps
          current={currentStep}
          onChange={goToStep}
          items={steps.map((step) => ({ title: step.title }))}
          className="user-form-steps"
        />

        <Form
          form={form}
          layout="vertical"
          className="user-form"
          initialValues={{
            gender: "M",
            nationality: "Việt Nam",
            isActive: true,
          }}
        >
          <div className="step-content">{steps[currentStep].content}</div>

          <div className="form-actions">
            <Button onClick={handleCancel} size="large" disabled={loading}>
              Hủy
            </Button>

            {!isFirstStep && (
              <Button onClick={prevStep} size="large" disabled={loading}>
                Quay lại
              </Button>
            )}

            {!isLastStep ? (
              <Button
                type="primary"
                onClick={nextStep}
                size="large"
                className="gradient-button"
              >
                Tiếp theo
              </Button>
            ) : (
              <Button
                type="primary"
                onClick={handleSubmit}
                loading={loading}
                size="large"
                className="gradient-button"
              >
                Tạo nhân viên
              </Button>
            )}
          </div>
        </Form>
      </div>
    </Modal>
  );
}
