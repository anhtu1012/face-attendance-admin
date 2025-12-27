/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { Form } from "antd";
import type { FormInstance } from "antd";
import { UserFormStep, UserModalMode } from "../_types/user-form.types";
import { showSuccess, showError } from "@/hooks/useNotification";
import QlNguoiDungServices from "@/services/admin/quan-li-nguoi-dung/quan-li-nguoi-dung.service";

interface UseUserFormProps {
  mode: UserModalMode;
  userData?: any;
  onSuccess?: () => void;
  onCancel: () => void;
}

export function useUserForm({ mode, userData, onSuccess, onCancel }: UseUserFormProps) {
  const [form] = Form.useForm();
  const [currentStep, setCurrentStep] = useState<UserFormStep>(UserFormStep.BASIC_INFO);
  const [loading, setLoading] = useState(false);

  // Step navigation
  const nextStep = () => {
    if (currentStep < UserFormStep.BANKING) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > UserFormStep.BASIC_INFO) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const goToStep = (step: UserFormStep) => {
    setCurrentStep(step);
  };

  // Form submission
  const handleSubmit = async () => {
    try {
      // Validate all fields first
      await form.validateFields();
      
      // Get all form values (including fields from all steps)
      const values = form.getFieldsValue(true);
      
      setLoading(true);

      if (mode === "add") {
        await QlNguoiDungServices.createUser(values);
        showSuccess("Thêm nhân viên thành công!");
      } else {
        await QlNguoiDungServices.updateUser(userData.id, values);
        showSuccess("Cập nhật nhân viên thành công!");
      }

      form.resetFields();
      setCurrentStep(UserFormStep.BASIC_INFO);
      onCancel();
      onSuccess?.();
    } catch (error: any) {
      if (error.errorFields) {
        // Validation errors - show which step has errors
        showError("Vui lòng kiểm tra lại thông tin các bước trước!");
        return;
      }
      console.error("Error submitting user form:", error);
      showError(
        error.response?.data?.message ||
          (mode === "add" ? "Thêm nhân viên thất bại!" : "Cập nhật nhân viên thất bại!")
      );
    } finally {
      setLoading(false);
    }
  };

  // Reset form and step when modal closes
  const handleCancel = () => {
    form.resetFields();
    setCurrentStep(UserFormStep.BASIC_INFO);
    onCancel();
  };

  return {
    form,
    currentStep,
    loading,
    nextStep,
    prevStep,
    goToStep,
    handleSubmit,
    handleCancel,
  };
}
