/* eslint-disable @typescript-eslint/no-explicit-any */
import { FormInstance } from "antd";
import { UploadFile } from "antd/es/upload/interface";
import { UserInfor } from "@/dtos/auth/auth.dto";
import { UserContractItem } from "@/dtos/quan-li-nguoi-dung/contracts/contract.dto";

// Main component props
export interface UserContactFormProps {
  form?: FormInstance;
  selectedContactHistory?: UserContractItem[];
  editingContract?: any | null;
  isModalVisible?: boolean;
  isVisible?: boolean;
  handleCancel?: () => void;
  onCancel?: () => void;
  handleSubmit?: (editingContract?: string) => void;
  editLoading?: boolean;
  loading?: boolean;
  fileList?: UploadFile[];
  positions?: { label: string; value: string }[];
  branches?: { label: string; value: string }[];
  handleUploadChange?: (info: any) => void;
  isViewMode?: boolean;
  contactData?: UserContractItem;
  ueserDetails?: UserInfor;
  onSwitchToEditMode?: () => void;
  contractHistory?: UserContractItem[];
}

// Contract modal view type
export type ContractModalView = "history" | "detail";

// Contract history modal props
export interface ContractHistoryModalProps {
  visible: boolean;
  onCancel: () => void;
  contractHistory: UserContractItem[];
  onViewDetail: (contract: UserContractItem) => void;
  view: ContractModalView;
  selectedContract: UserContractItem | null;
  onBackToHistory: () => void;
}

// Contract form view props
export interface ContractFormViewProps {
  form: FormInstance;
  editingContract?: any | null;
  fileList?: UploadFile[];
  positions?: { label: string; value: string }[];
  branches?: { label: string; value: string }[];
  handleUploadChange?: (info: any) => void;
  ueserDetails?: UserInfor;
  onSubmit?: () => void;
  loading?: boolean;
}

// Contract view mode props - now supports both data types
export interface ContractViewModeProps {
  contactData?: UserContractItem;
  contract?: UserContractItem;
  positions?: { label: string; value: string }[];
  onSwitchToEditMode?: () => void;
  onShowHistory?: () => void;
  onBack?: () => void;
}
