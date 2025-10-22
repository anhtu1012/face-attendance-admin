export { default } from "./FilterDropdown";

export interface FilterValues {
  fromDate: string;
  toDate: string;
  status: string;
}
export interface FilterDropdownProps {
  onFilter: (values: FilterValues) => void;
  statusOptions: { label: string; value: string }[];
  loading?: boolean;
}
