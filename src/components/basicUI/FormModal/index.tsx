/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import { Modal, Form, FormInstance } from "antd";
import "./styles.scss";
import styles from "../../styles/styles.module.scss";

export interface FormModalProps {
  title: React.ReactNode; // Title of the modal
  form: FormInstance<any>; // Form instance from antd
  open: boolean; // Whether the modal is visible
  onCancel: () => void; // Handle modal close
  onOk: () => void; // Handle form submission
  okText?: string; // Custom OK button text
  cancelText?: string; // Custom cancel button text
  width?: number | string; // Modal width
  children: React.ReactNode; // Form content
  className?: string; // Additional class name
  formClassName?: string; // Form class name
  loading?: boolean; // Loading state for the OK button
  maskClosable?: boolean; // Whether clicking the mask closes the modal
  destroyOnClose?: boolean; // Whether to destroy component on close
  centered?: boolean; // Whether to center the modal
  footer?: React.ReactNode | null; // Custom footer
  initialValues?: any; // Initial values for the form
}

/**
 * FormModal - A reusable modal component for displaying forms
 */
const FormModal: React.FC<FormModalProps> = ({
  title,
  form,
  open,
  onCancel,
  onOk,
  okText = "Lưu",
  cancelText = "Hủy",
  width = 600,
  children,
  className = "",
  formClassName = styles.userForm, // Set userForm as default
  loading = false,
  maskClosable = false,
  destroyOnClose = true,
  centered = true,
  footer,
  initialValues = {},
}) => {
  return (
    <Modal
      title={title}
      open={open}
      onCancel={onCancel}
      onOk={onOk}
      okText={okText}
      cancelText={cancelText}
      confirmLoading={loading}
      width={width}
      className={`form-modal ${styles.userModal}`}
      centered={centered}
      maskClosable={maskClosable}
      destroyOnClose={destroyOnClose}
      footer={footer}
    >
      <Form
        form={form}
        layout="vertical"
        className={`form-modal-content ${className} ${formClassName} `}
        initialValues={initialValues}
      >
        {children}
      </Form>
    </Modal>
  );
};

export default FormModal;
