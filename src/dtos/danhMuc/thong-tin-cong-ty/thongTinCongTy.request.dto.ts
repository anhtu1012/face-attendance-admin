import { z } from "zod";
import { CompanyInfoSchema, ShiftSchema } from "./thongTinCongTy.dto";

/**
 * Schema and type for creating company information
 */
export const CreateCompanyInfoSchema = z.object({
  unitKey: z.string().optional(),
  logoUrl: z.string().nullable().optional(),
  taxCode: z
    .string()
    .min(10, "Tax code must be at least 10 characters")
    .max(13, "Tax code must not exceed 13 characters"),
  shortName: z
    .string()
    .min(2, "Short name must be at least 2 characters")
    .max(50, "Short name must not exceed 50 characters"),
  companyName: z.string().min(5, "Company name must be at least 5 characters"),
  establishDate: z.string().or(z.date()),
  businessLicenseNo: z.string().min(1, "Business license number is required"),
  addressLine: z.string().min(1, "Address is required"),
  placeId: z.string(),
  city: z.string().min(1, "City is required"),
  district: z.string().min(1, "District is required"),
  country: z.string().min(1, "Country is required"),
  phone: z.string().regex(/^[0-9+\-\s()]+$/, "Invalid phone number format"),
  email: z.string().email("Invalid email format"),
  website: z.string().url("Invalid website URL").nullable().optional(),
  fullName: z.string().min(1, "Legal representative name is required"),
  position: z.string().min(1, "Position is required"),
  identityNumber: z
    .string()
    .min(9, "Identity number must be at least 9 characters"),
  identityIssuedDate: z.string().or(z.date()),
  identityIssuedPlace: z.string().min(1, "Identity issued place is required"),
  lat: z.string().or(z.number()),
  long: z.string().or(z.number()),
  shift: z.array(ShiftSchema).min(1, "At least one shift is required"),
});

export type CreateCompanyInfoRequest = z.infer<typeof CreateCompanyInfoSchema>;

/**
 * Schema and type for updating company information
 */
export const UpdateCompanyInfoSchema = CompanyInfoSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  createdBy: true,
  updatedBy: true,
})
  .partial()
  .extend({
    taxCode: z
      .string()
      .min(10, "Tax code must be at least 10 characters")
      .max(13, "Tax code must not exceed 13 characters")
      .optional(),
    shortName: z
      .string()
      .min(2, "Short name must be at least 2 characters")
      .max(50, "Short name must not exceed 50 characters")
      .optional(),
    companyName: z
      .string()
      .min(5, "Company name must be at least 5 characters")
      .optional(),
    phone: z
      .string()
      .regex(/^[0-9+\-\s()]+$/, "Invalid phone number format")
      .optional(),
    email: z.string().email("Invalid email format").optional(),
    website: z.string().url("Invalid website URL").nullable().optional(),
    identityNumber: z
      .string()
      .min(9, "Identity number must be at least 9 characters")
      .optional(),
    shift: z
      .array(ShiftSchema)
      .min(1, "At least one shift is required")
      .optional(),
  });

export type UpdateCompanyInfoRequest = z.infer<typeof UpdateCompanyInfoSchema>;
