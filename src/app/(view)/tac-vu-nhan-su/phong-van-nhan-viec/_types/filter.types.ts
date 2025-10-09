export interface FilterValues {
  fromDate?: string;
  toDate?: string;
  // allow multiple selected statuses
  status?: string | string[];
  quickSearch?: string;
}

export interface FilterDropdownProps {
  onFilter: (values: FilterValues) => void;
  statusOptions: Array<{ label: string; value: string }>;
  loading?: boolean;
}
