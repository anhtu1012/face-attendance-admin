/* eslint-disable @typescript-eslint/no-explicit-any */

/**
 * User form data type representing all fields in the user form
 */
export interface UserFormData {
  // Basic Information
  userName: string;
  fullName: string;
  email: string;
  phone: string;
  gender: "M" | "F";
  birthday: string;

  // Organization
  roleId: string;
  departmentId: string;
  positionId: string;
  manageByUserId?: string;
  levelSalaryId: string;

  // Personal Information
  nation?: string;
  nationality?: string;
  marriedStatus?: string;
  militaryStatus?: string;

  // Identity Documents
  citizenIdentityCard: string;
  issueDate: string;
  issueAt: string;
  taxCode?: string;
  identityCardImgFront?: string | null;
  identityCardImgBack?: string | null;

  // Address
  permanentAddress: string;
  currentAddress?: string;

  // Banking
  bankingName?: string;
  bankingAccountNo?: string;
  bankingAccountName?: string;

  // System fields (for update mode)
  id?: string;
  userCode?: string;
  faceImg?: string | null;
  isActive?: boolean;
  isRegisterFace?: boolean;
  userPushToken?: string;
  status?: string | null;
  reason?: string | null;
}

/**
 * Form steps for multi-step wizard
 */
export enum UserFormStep {
  BASIC_INFO = 0,
  ORGANIZATION = 1,
  PERSONAL_INFO = 2,
  IDENTITY = 3,
  ADDRESS = 4,
  BANKING = 5,
}

/**
 * Modal mode type
 */
export type UserModalMode = "add" | "update";

/**
 * Step configuration for the wizard
 */
export interface StepConfig {
  title: string;
  description: string;
  fields: (keyof UserFormData)[];
}

/**
 * Props for user modal components
 */
export interface UserModalProps {
  open: boolean;
  onCancel: () => void;
  onSuccess?: () => void;
  userData?: any;
  mode: UserModalMode;
}

/**
 * Props for form step components
 */
export interface FormStepProps {
  form: any;
  loading?: boolean;
}
