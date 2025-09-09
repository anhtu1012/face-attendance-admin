import { z } from "zod";
import { UserInforSchema } from "./auth.dto";

/**
 * Schema and type for response auth login
 */
export const UserResponseLoginSchema = z.object({
  accessToken: z.string(),
  refreshToken: z.string(),
  userProfile: UserInforSchema,
});

export type UserResponseLoginItem = z.infer<typeof UserResponseLoginSchema>;

export const UserResponseLogoutSchema = z.object({
  is_clear_cookie: z.boolean(),
  message: z.string(),
  ok: z.boolean(),
});

export type UserResponseLogoutItem = z.infer<typeof UserResponseLogoutSchema>;

/**
 * Schema and type for response auth registration
 */
export const UserResponseRegisterSchema = UserInforSchema;

export type UserResponseRegisterItem = z.infer<
  typeof UserResponseRegisterSchema
>;

/**
 * Schema and type for paginated user get response
 */
export const UserResponseGetSchema = z.object({
  count: z.number(),
  limit: z.number(),
  page: z.number(),
  data: z.array(UserInforSchema),
});

export type UserResponseGetItem = z.infer<typeof UserResponseGetSchema>;
