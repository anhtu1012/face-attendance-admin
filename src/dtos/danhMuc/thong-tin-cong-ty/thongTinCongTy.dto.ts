import { z } from "zod";

export const ShiftSchema = z.object({
  shiftName: z.string(),
  startTime: z.string(),
  endTime: z.string(),
});
export const RepresentatorSchema = z.object({
  legalRepresentativeId: z.string(),
  legalRepresentativeName: z.string(),
  identityNumber: z.string(),
  identityIssuedDate: z.string().or(z.date()),
  identityIssuedPlace: z.string(),
});

export const CompanyInfoSchema = z.object({
  id: z.string().or(z.bigint()).optional(),
  unitKey: z.string().optional(),
  logoUrl: z.string().nullable().optional(),
  taxCode: z.string().optional(),
  shortName: z.string().optional(),
  companyName: z.string(),
  legalRepresentativeId: z.string().optional(),
  establishDate: z.string().or(z.date()).optional(),
  businessLicenseNo: z.string().optional(),
  addressLine: z.string().optional(),
  placeId: z.string().optional(),
  city: z.string().optional(),
  district: z.string().optional(),
  country: z.string().optional(),
  phone: z.string().optional(),
  email: z.string().email().optional(),
  website: z.string().url().nullable().optional(),
  lat: z.string().optional(),
  long: z.string().optional(),
  offDays: z.array(z.string()).optional(),
  shifts: z.array(ShiftSchema).optional(),
  representator: RepresentatorSchema.optional(),
  identityIssuedDate: z.string().or(z.date()).optional(),

  createdAt: z.string().or(z.date()).optional(),
  updatedAt: z.string().or(z.date()).optional(),
  createdBy: z.string().optional(),
  updatedBy: z.string().optional(),
});

export type Shift = z.infer<typeof ShiftSchema>;
export type CompanyInfo = z.infer<typeof CompanyInfoSchema>;
