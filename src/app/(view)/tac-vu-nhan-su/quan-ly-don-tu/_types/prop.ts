import { Dayjs } from "dayjs";

export interface FormValues {
  filterDateRange?: [Dayjs, Dayjs];
  status?: string;
  approvedName?: string;
  submittedName?: string;
}

export interface FilterRef {
  getFormValues: () => Partial<FormValues>;
}

export interface TableApplicationRef {
  refetch: () => void;
}

export interface TableApplicationProps {
  filterRef: React.RefObject<FilterRef | null>;
}

export interface FilterProps {
  onSubmit: () => void;
}
