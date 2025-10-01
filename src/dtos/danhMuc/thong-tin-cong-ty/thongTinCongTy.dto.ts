import { z } from "zod";

export const ShiftSchema = z.object({
  shiftName: z.string(),
  startTime: z.string(),
  endTime: z.string(),
});

export const CompanyInfoSchema = z.object({
  id: z.string().or(z.bigint()).optional(),
  unitKey: z.string().optional(),
  logoURL: z.string().nullable().optional(),
  taxCode: z.string(),
  shortName: z.string(),
  companyName: z.string(),
  establishDate: z.string().or(z.date()),
  businessLicenseNo: z.string(),
  addressLine: z.string(),
  placeId: z.string(),
  city: z.string(),
  district: z.string(),
  country: z.string(),
  phone: z.string(),
  email: z.string().email(),
  website: z.string().url().nullable().optional(),
  fullName: z.string(),
  position: z.string(),
  identityNumber: z.string(),
  identityIssuedDate: z.string().or(z.date()),
  identityIssuedPlace: z.string(),
  lat: z.string(),
  long: z.string(),
  shifts: z.array(ShiftSchema),
  createdAt: z.string().or(z.date()).optional(),
  updatedAt: z.string().or(z.date()).optional(),
  createdBy: z.string().optional(),
  updatedBy: z.string().optional(),
});

export type Shift = z.infer<typeof ShiftSchema>;
export type CompanyInfo = z.infer<typeof CompanyInfoSchema>;
