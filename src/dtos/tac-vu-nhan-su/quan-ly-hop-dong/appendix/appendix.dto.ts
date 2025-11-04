import { z } from "zod";

//  Appendix Status Enum using Zod
export const AppendixStatusEnum = z.enum([
  "ACTIVE",
  "INACTIVE",
  "EXPIRED",
  "PENDING",
]);

export type AppendixStatus = z.infer<typeof AppendixStatusEnum>;

// Allowance info in contract detail
export const AllowanceInforSchema = z.object({
  allowanceId: z.string(),
  allowanceName: z.string(),
  allowanceCode: z.string(),
  value: z.string(),
});

export type AllowanceInfor = z.infer<typeof AllowanceInforSchema>;

// Detailed Contract schema matching the payload in the request
export const AppendixDetailSchema = z.object({
  id: z.string(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
  userContractId: z.string(),
  positionId: z.string(),
  contractTypeId: z.string(),
  contractTypeName: z.string(),
  companyId: z.string(),
  grossSalary: z.string(),
  contractNumber: z.string(),
  content: z.string(),
  fileContract: z.string().nullable().optional(),
  startDate: z.string().datetime(),
  endDate: z.string().datetime().nullable().optional(),
  duration: z.string(),
  status: AppendixStatusEnum,
  allowanceInfors: z.array(AllowanceInforSchema).optional(),
  userSignature: z.string().nullable().optional(),
  directorSignature: z.string().nullable().optional(),
  otpVerified: z.boolean().optional(),
  otpVerifiedAt: z.string().nullable().optional(),
});

export type AppendixDetail = z.infer<typeof AppendixDetailSchema>;

// User information schema matching the payload in the request
export const UserInforSchema = z.object({
  userId: z.string(),
  userCode: z.string().nullable().optional(),
  userName: z.string(),
  password: z.string(),
  roleId: z.string(),
  departmentId: z.string().nullable().optional(),
  manageByUserId: z.string().nullable().optional(),
  manageByFullName: z.string().nullable().optional(),
  fullName: z.string(),
  email: z.string().email().optional(),
  phone: z.string().optional(),
  gender: z.string().optional(),
  birthday: z.string().datetime().optional().nullable(),
  faceImg: z.string().nullable().optional(),
  marriedStatus: z.string().nullable().optional(),
  nation: z.string().nullable().optional(),
  bankingAccountNo: z.string().nullable().optional(),
  bankingAccountName: z.string().nullable().optional(),
  bankingName: z.string().nullable().optional(),
  militaryStatus: z.string().nullable().optional(),
  citizenIdentityCard: z.string().optional(),
  identityCardImgFront: z.string().nullable().optional(),
  identityCardImgBack: z.string().nullable().optional(),
  taxCode: z.string().nullable().optional(),
  issueDate: z.string().datetime().optional().nullable(),
  issueAt: z.string().nullable().optional(),
  nationality: z.string().nullable().optional(),
  permanentAddress: z.string().nullable().optional(),
  currentAddress: z.string().nullable().optional(),
  status: z.string().nullable().optional(),
  isActive: z.boolean().optional(),
});

export type UserInfor = z.infer<typeof UserInforSchema>;

// Combined payload schema: contract + userInfor
export const AppendixWithUserSchema = z.object({
  contract: AppendixDetailSchema,
  userInfor: UserInforSchema,
});

export type AppendixWithUser = z.infer<typeof AppendixWithUserSchema>;
