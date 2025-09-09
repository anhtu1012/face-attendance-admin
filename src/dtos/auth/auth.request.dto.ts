import { z } from "zod";
import { UserInforSchema } from "./auth.dto";

/**
 * Schema and type for user login
 */

export const UserRequestLoginSchema = z.object({
  username: z.string(),
  password: z.string(),
});

export type UserRequestLoginItem = z.infer<typeof UserRequestLoginSchema>;

/**
 * Schema and type for user registration
 */
export const UserRequestRegisterSchema = z.object({
  userName: z.string().min(3, "Username must be at least 3 characters"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  roleCode: z.string(),
  firstName: z.string(),
  lastName: z.string(),
  email: z.string().email("Invalid email format"),
  faceImg: z.string().optional().or(z.null()),
  contract: z.string().optional(),
  dob: z.string().refine((value) => {
    try {
      return !isNaN(Date.parse(value));
    } catch {
      return false;
    }
  }, "dob must be a valid ISO 8601 date string"),
  phone: z.string(),
  gender: z
    .string()
    .max(2, "gender must be shorter than or equal to 2 characters")
    .min(1, "gender should not be empty"),
  addressCode: z
    .string()
    .max(20, "addressCode must be shorter than or equal to 20 characters")
    .min(1, "addressCode should not be empty"),
  // faceImg and contract are excluded as requested
});

export type UserRequestRegisterItem = z.infer<typeof UserRequestRegisterSchema>;

//update
export const UserRequestChangePasswordSchema = UserInforSchema.omit({
  id: true,
})
  .partial()
  .extend({
    // All fields are optional, but when provided they must pass validation
    userName: z
      .string()
      .min(3, "Username must be at least 3 characters")
      .optional(),
    password: z
      .string()
      .min(6, "Password must be at least 6 characters")
      .optional(),
    roleCode: z.string().optional(),
    firstName: z.string().optional(),
    lastName: z.string().optional(),
    email: z.string().email("Invalid email format").optional(),
    faceImg: z.string().optional().or(z.null()),
    dob: z.string().or(z.date()).optional(),
    addressCode: z
      .string()
      .max(20, "AddressCode must be shorter than or equal to 20 characters")
      .min(1, "AddressCode should not be empty")
      .optional(),
    phone: z.string().optional(),
    branchCode: z.string().optional(),
    managedBy: z.string().optional(),
    positionCode: z.string().optional(),
    isActive: z.boolean().optional(),
  });
export type UserRequestUpdateUsser = z.infer<
  typeof UserRequestChangePasswordSchema
>;
