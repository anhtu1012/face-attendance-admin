export enum ContractStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  EXPIRED = 'EXPIRED',
  PENDING = 'PENDING'
}

export interface UserContract {
  id: string;
  createdAt: string;
  updatedAt: string;
  code: string;
  title: string;
  description: string;
  startTime: string;
  endTime: string;
  duration: string;
  contractPdf: string;
  status: ContractStatus;
  userCode: string;
  userBranchCode?: string;
  managedBy: string;
  positionCode: string;
  branchNames?: string;
  branchCodes: string[];
}
