import { z } from "zod";

// Contract Status Enum using Zod
export const ContractStatusEnum = z.enum([
  "PENDING",
  "USER_SIGNED",
  "DIRECTOR_SIGNED",
  "INACTIVE",
  "EXPIRED",
  "ACTIVE",
]);

export type ContractStatus = z.infer<typeof ContractStatusEnum>;

// Contract Item Schema
export const UserContractItemSchema = z.object({
  id: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
  userContractCode: z.string(),
  userId: z.string(),
  managedById: z.string(),
  titleContractId: z.string(),
  allowanceId: z.number(),
  positionId: z.string(),
  contractNumber: z.string(),
  description: z.string(),
  contractType: z.string(),
  baseSalary: z.number(),
  startDate: z.string(),
  endDate: z.string(),
  duration: z.number(),
  contractPdf: z.string(),
  status: ContractStatusEnum,
  branchCodes: z.array(z.string()),
  branchNames: z.array(z.string()),
  fullNameUser: z.string(),
  fullNameManager: z.string(),
  titleContractName: z.string(),
  allowanceName: z.string(),
  positionName: z.string(),
  contentMd: z.string(),
  contentHtml: z.string(),
  userSignature: z.string(),
  directorSignature: z.string(),
  fileContract: z.string(),
  contractTypeName: z.string(),
  departmentName: z.string(),
  isSignature: z.boolean(),
  content: z.string(),
  grossSalary: z.string(),
  otpVerified: z.boolean(),
  otpVerifiedAt: z.string(),
  allowanceInfors: z.array(
    z.object({
      allowanceId: z.string(),
      allowanceName: z.string(),
      allowanceCode: z.string(),
      value: z.string(),
    })
  ),
});

export type UserContractItem = z.infer<typeof UserContractItemSchema>;

// File type for browser environment
const FileSchema = z.instanceof(File);

// Create Contract Schema for API (without file)
export const CreateContractSchema = z.object({
  userContractCode: z.string().min(1, "User contract code is required"),
  userId: z.string().min(1, "User ID is required"),
  managedById: z.string().min(1, "Managed by ID is required"),
  titleContractId: z.string().min(1, "Title contract ID is required"),
  allowanceId: z.number().min(1, "Allowance ID is required"),
  positionId: z.string().min(1, "Position ID is required"),
  contractNumber: z.string().min(1, "Contract number is required"),
  description: z.string(),
  contractType: z.string().min(1, "Contract type is required"),
  baseSalary: z.number().min(0, "Base salary must be non-negative"),
  startDate: z.string().datetime(),
  endDate: z.string().datetime(),
  duration: z.number(),
  contractPdf: z.string().optional(),
  status: ContractStatusEnum,
  branchCodes: z.array(z.string()),
  fullNameUser: z.string().optional(),
  fullNameManager: z.string().optional(),
  titleContractName: z.string().optional(),
  allowanceName: z.string().optional(),
  positionName: z.string().optional(),
  contentMd: z.string().optional(),
  contentHtml: z.string().optional(),
  userSignature: z.string().optional(),
  directorSignature: z.string().optional(),
  otpVerified: z.boolean().optional(),
  otpVerifiedAt: z.string().optional(),
});

// Create Contract Form Schema (with file for form handling)
export const CreateContractFormSchema = z.object({
  userContractCode: z.string().min(1, "User contract code is required"),
  userId: z.string().min(1, "User ID is required"),
  managedById: z.string().min(1, "Managed by ID is required"),
  titleContractId: z.string().min(1, "Title contract ID is required"),
  allowanceId: z.number().min(1, "Allowance ID is required"),
  positionId: z.string().min(1, "Position ID is required"),
  contractNumber: z.string().min(1, "Contract number is required"),
  description: z.string(),
  contractType: z.string().min(1, "Contract type is required"),
  baseSalary: z.number().min(0, "Base salary must be non-negative"),
  startDate: z.string().datetime(),
  endDate: z.string().datetime(),
  duration: z.number(),
  contractPdf: FileSchema.optional(),
  status: ContractStatusEnum,
  branchCodes: z.array(z.string()),
  fullNameUser: z.string().optional(),
  fullNameManager: z.string().optional(),
  titleContractName: z.string().optional(),
  allowanceName: z.string().optional(),
  positionName: z.string().optional(),
  contentMd: z.string().optional(),
  contentHtml: z.string().optional(),
  userSignature: z.string().optional(),
  directorSignature: z.string().optional(),
  otpVerified: z.boolean().optional(),
  otpVerifiedAt: z.string().optional(),
});

// Lightweight Create Contract Request schema (matches frontend create payload)
export const CreateContractRequestSchema = z.object({
  userId: z.string().min(1, "User ID is required"),
  userContractId: z.string().min(1, "User contract ID is required").optional(),
  contractTypeId: z.string().min(1, "Contract type ID is required"),
  positionId: z.string().min(1, "Position ID is required"),
  grossSalary: z.string().min(1, "Gross salary is required"),
  content: z.string().min(1, "Content is required"),
  startDate: z.string().datetime(),
  endDate: z.string().datetime(),
  allowanceIds: z.array(z.string()).optional(),
});

// Update Contract Schema for API (without file)
export const UpdateContractSchema = z.object({
  userContractCode: z
    .string()
    .min(1, "User contract code is required")
    .optional(),
  userId: z.string().min(1, "User ID is required").optional(),
  managedById: z.string().min(1, "Managed by ID is required").optional(),
  titleContractId: z
    .string()
    .min(1, "Title contract ID is required")
    .optional(),
  allowanceId: z.number().min(1, "Allowance ID is required").optional(),
  positionId: z.string().min(1, "Position ID is required").optional(),
  contractNumber: z.string().min(1, "Contract number is required").optional(),
  description: z.string().optional(),
  contractType: z.string().min(1, "Contract type is required").optional(),
  baseSalary: z.number().min(0, "Base salary must be non-negative").optional(),
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional(),
  duration: z.number().optional(),
  contractPdf: z.string().optional(),
  status: ContractStatusEnum.optional(),
  branchCodes: z.array(z.string()).optional(),
  fullNameUser: z.string().optional(),
  fullNameManager: z.string().optional(),
  titleContractName: z.string().optional(),
  allowanceName: z.string().optional(),
  positionName: z.string().optional(),
  contentMd: z.string().optional(),
  contentHtml: z.string().optional(),
  userSignature: z.string().optional(),
  directorSignature: z.string().optional(),
  otpVerified: z.boolean().optional(),
  otpVerifiedAt: z.string().optional(),
});

// Update Contract Form Schema (with file for form handling)
export const UpdateContractFormSchema = z.object({
  userContractCode: z
    .string()
    .min(1, "User contract code is required")
    .optional(),
  userId: z.string().min(1, "User ID is required").optional(),
  managedById: z.string().min(1, "Managed by ID is required").optional(),
  titleContractId: z
    .string()
    .min(1, "Title contract ID is required")
    .optional(),
  allowanceId: z.number().min(1, "Allowance ID is required").optional(),
  positionId: z.string().min(1, "Position ID is required").optional(),
  contractNumber: z.string().min(1, "Contract number is required").optional(),
  description: z.string().optional(),
  contractType: z.string().min(1, "Contract type is required").optional(),
  baseSalary: z.number().min(0, "Base salary must be non-negative").optional(),
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional(),
  duration: z.number().optional(),
  contractPdf: FileSchema.optional(),
  status: ContractStatusEnum.optional(),
  branchCodes: z.array(z.string()).optional(),
  fullNameUser: z.string().optional(),
  fullNameManager: z.string().optional(),
  titleContractName: z.string().optional(),
  allowanceName: z.string().optional(),
  positionName: z.string().optional(),
  contentMd: z.string().optional(),
  contentHtml: z.string().optional(),
  userSignature: z.string().optional(),
  directorSignature: z.string().optional(),
  otpVerified: z.boolean().optional(),
  otpVerifiedAt: z.string().optional(),
});

// Allowance info in contract detail
export const AllowanceInforSchema = z.object({
  allowanceId: z.string(),
  allowanceName: z.string(),
  allowanceCode: z.string(),
  value: z.string(),
});

export type AllowanceInfor = z.infer<typeof AllowanceInforSchema>;

// Detailed Contract schema matching the payload in the request
export const ContractDetailSchema = z.object({
  id: z.string(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
  userId: z.string(),
  fullNameUser: z.string(),
  departmentId: z.string(),
  departmentName: z.string(),
  positionId: z.string(),
  positionName: z.string(),
  contractTypeId: z.string(),
  contractTypeName: z.string(),
  companyId: z.string(),
  grossSalary: z.string(),
  contractNumber: z.string(),
  content: z.string(),
  fileContract: z.string().nullable().optional(),
  startDate: z.string().datetime(),
  endDate: z.string().datetime(),
  duration: z.string(),
  status: ContractStatusEnum,
  allowanceInfors: z.array(AllowanceInforSchema).optional(),
  userSignature: z.string().nullable().optional(),
  directorSignature: z.string().nullable().optional(),
  otpVerified: z.boolean().optional(),
  otpVerifiedAt: z.string().nullable().optional(),
});

export type ContractDetail = z.infer<typeof ContractDetailSchema>;

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
export const ContractWithUserSchema = z.object({
  contract: ContractDetailSchema,
  userInfor: UserInforSchema,
});

export type ContractWithUser = z.infer<typeof ContractWithUserSchema>;
