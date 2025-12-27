/* eslint-disable @typescript-eslint/no-explicit-any */
import { Modal, Steps, Button, Form } from "antd";
import { EditOutlined } from "@ant-design/icons";
import { useEffect } from "react";
import dayjs from "dayjs";
import { useUserForm } from "../../_hooks/useUserForm";
import { UserFormStep } from "../../_types/user-form.types";
import {
  BasicInfoStep,
  OrganizationStep,
  PersonalInfoStep,
  IdentityStep,
  AddressStep,
  BankingStep,
} from "../AddUserModal/steps";
import "../AddUserModal/AddUserModal.scss";

interface UpdateUserModalProps {
  open: boolean;
  onCancel: () => void;
  onSuccess?: () => void;
  userData: any;
}

export function UpdateUserModal({
  open,
  onCancel,
  onSuccess,
  userData,
}: UpdateUserModalProps) {
  const { form, currentStep, loading, nextStep, prevStep, goToStep, handleSubmit, handleCancel } =
    useUserForm({
      mode: "update",
      userData,
      onSuccess,
      onCancel,
    });

  // Pre-populate form when userData changes
  useEffect(() => {
    if (userData && open) {
      form.setFieldsValue({
        // Basic Info
        userName: userData.userName,
        fullName: userData.fullName,
        email: userData.email,
        phone: userData.phone,
        gender: userData.gender,
        birthday: userData.birthday ? dayjs(userData.birthday) : null,

        // Organization
        roleId: userData.roleId,
        departmentId: userData.departmentId,
        positionId: userData.positionId,
        manageByUserId: userData.manageByUserId,
        levelSalaryId: userData.levelSalaryId,

        // Personal Info
        nation: userData.nation,
        nationality: userData.nationality || "Việt Nam",
        marriedStatus: userData.marriedStatus,
        militaryStatus: userData.militaryStatus,

        // Identity
        citizenIdentityCard: userData.citizenIdentityCard,
        issueDate: userData.issueDate ? dayjs(userData.issueDate) : null,
        issueAt: userData.issueAt,
        taxCode: userData.taxCode,

        // Address
        permanentAddress: userData.permanentAddress,
        currentAddress: userData.currentAddress,

        // Banking
        bankingName: userData.bankingName,
        bankingAccountNo: userData.bankingAccountNo,
        bankingAccountName: userData.bankingAccountName,
      });
    }
  }, [userData, open, form]);

  const steps = [
    {
      title: "Thông tin cơ bản",
      content: <BasicInfoStep mode="update" />,
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
          <EditOutlined /> Cập nhật thông tin nhân viên
        </div>
      }
      open={open}
      onCancel={handleCancel}
      footer={null}
      width={1000}
      className="add-user-modal update-user-modal"
      destroyOnClose
    >
      <div className="modal-content-wrapper">
        {userData && (
          <div className="user-info-banner">
            <div className="user-info">
              <div className="user-name">{userData.fullName}</div>
              <div className="user-email">
                {userData.userCode} • {userData.email}
              </div>
            </div>
          </div>
        )}

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
                Cập nhật
              </Button>
            )}
          </div>
        </Form>
      </div>
    </Modal>
  );
}
