/* eslint-disable @typescript-eslint/no-explicit-any */
export interface FilterRef {
  submitForm: () => void;
  getFormValues: () => any;
  validateForm: () => Promise<boolean>;
  resetForm: () => void;
  handleCreateNewOrder: () => void;
}
export interface FilterProps {
  disabled?: boolean;
}

export interface UserWithByRoleProps {
  roleCode: { label: string; value: string }[];
  shouldFetch?: boolean;
}
