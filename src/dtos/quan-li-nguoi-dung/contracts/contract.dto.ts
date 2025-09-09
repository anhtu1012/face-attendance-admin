import { z } from "zod";

// Contract Status Enum using Zod
export const ContractStatusEnum = z.enum([
  "ACTIVE",
  "INACTIVE",
  "EXPIRED",
  "PENDING",
]);

export type ContractStatus = z.infer<typeof ContractStatusEnum>;

// Contract Item Schema
export const UserContractItemSchema = z.object({
  id: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
  code: z.string(),
  title: z.string(),
  description: z.string(),
  startTime: z.string(),
  endTime: z.string(),
  duration: z.string(),
  contractPdf: z.string(),
  status: ContractStatusEnum,
  userCode: z.string(),
  managedBy: z.string(),
  positionCode: z.string(),
  branchNames: z.string(),
  branchCodes: z.array(z.string()),
  baseSalary: z.number().optional(),
  fullName: z.string().optional(),
  fullNameManager: z.string().optional(),
  note: z.string().optional(),
});

export type UserContractItem = z.infer<typeof UserContractItemSchema>;

// File type for browser environment
const FileSchema = z.instanceof(File);

// Create Contract Schema for API (without file)
export const CreateContractSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string(),
  startTime: z.string().datetime(),
  endTime: z.string().datetime(),
  duration: z.string(),
  status: ContractStatusEnum,
  userCode: z.string().min(1, "User code is required"),
  managedBy: z.string(),
  positionCode: z.string(),
  branchCodes: z.array(z.string()),
});

// Create Contract Form Schema (with file for form handling)
export const CreateContractFormSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string(),
  startTime: z.string().datetime(),
  endTime: z.string().datetime(),
  duration: z.string(),
  contractPdf: FileSchema.optional(),
  status: ContractStatusEnum,
  userCode: z.string().min(1, "User code is required"),
  managedBy: z.string(),
  positionCode: z.string(),
  branchCodes: z.array(z.string()),
});

// Update Contract Schema for API (without file)
export const UpdateContractSchema = z.object({
  title: z.string().min(1, "Title is required").optional(),
  description: z.string().optional(),
  startTime: z.string().datetime().optional(),
  endTime: z.string().datetime().optional(),
  duration: z.string().optional(),
  status: ContractStatusEnum.optional(),
  userCode: z.string().min(1, "User code is required").optional(),
  userBranchCode: z.string().optional(),
  managedBy: z.string().optional(),
  positionCode: z.string().optional(),
  branchCodes: z.array(z.string()).optional(),
});

// Update Contract Form Schema (with file for form handling)
export const UpdateContractFormSchema = z.object({
  title: z.string().min(1, "Title is required").optional(),
  description: z.string().optional(),
  startTime: z.string().datetime().optional(),
  endTime: z.string().datetime().optional(),
  duration: z.string().optional(),
  contractPdf: FileSchema.optional(),
  status: ContractStatusEnum.optional(),
  userCode: z.string().min(1, "User code is required").optional(),
  userBranchCode: z.string().optional(),
  managedBy: z.string().optional(),
  positionCode: z.string().optional(),
  branchCodes: z.array(z.string()).optional(),
});
