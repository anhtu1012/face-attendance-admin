import { Dayjs } from "dayjs";

export interface ApplicationItem {
  id: string;
  createdAt: string;
  updatedAt: string;
  reason: string;
  response?: string;
  formCategoryId: string;
  formCategoryTitle: string;
  submittedBy: string;
  submittedName: string;
  approvedBy?: string;
  approvedName?: string;
  startTime: string;
  endTime: string;
  approvedTime?: string;
  files: string[]; // Array of image URLs
  status: "PENDING" | "APPROVED" | "REJECTED" | "CANCELLED";
}

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
