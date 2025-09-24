/* eslint-disable @typescript-eslint/no-explicit-any */

import { Dayjs } from "dayjs";

export interface FormValues {
  filterDateRange: Dayjs[];
  role: string;
  position: string;
  userName: string;
  contractType: string;
  status: string;
}
export interface FilterRef {
  submitForm: () => void;
  getFormValues: () => FormValues;
  validateForm: () => Promise<boolean>;
  resetForm: () => void;
  handleCreateNewOrder: () => void;
}
export interface FilterProps {
  disabled?: boolean;
  onSubmit?: () => void;
}

export interface TableContractRef {
  refetch: () => void;
}

export interface UserWithByRoleProps {
  roleCode: { label: string; value: string }[];
  shouldFetch?: boolean;
}

export interface TableContractProps {
  filterRef: React.RefObject<FilterRef | null>;
}
