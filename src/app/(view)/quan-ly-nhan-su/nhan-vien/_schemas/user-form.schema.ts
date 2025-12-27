import { z } from "zod";

/**
 * Vietnamese phone number regex (10 digits starting with 0)
 */
const PHONE_REGEX = /^0\d{9}$/;

/**
 * Citizen Identity Card regex (12 digits)
 */
const CITIZEN_ID_REGEX = /^\d{12}$/;

/**
 * Tax code regex (10-13 digits)
 */
const TAX_CODE_REGEX = /^\d{10,13}$/;

/**
 * Email validation regex
 */
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Username regex (alphanumeric + underscore)
 */
const USERNAME_REGEX = /^[a-zA-Z0-9_]+$/;

/**
 * Helper function to check if age is between min and max
 */
const isAgeInRange = (dateString: string, minAge: number, maxAge: number): boolean => {
  const birthDate = new Date(dateString);
  const today = new Date();
  const age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    return age - 1 >= minAge && age - 1 <= maxAge;
  }
  
  return age >= minAge && age <= maxAge;
};

/**
 * Comprehensive Zod schema for user form validation
 */
export const userFormSchema = z.object({
  // Basic Information
  userName: z
    .string()
    .min(3, "Tên đăng nhập phải có ít nhất 3 ký tự")
    .max(50, "Tên đăng nhập không được quá 50 ký tự")
    .regex(USERNAME_REGEX, "Tên đăng nhập chỉ được chứa chữ cái, số và dấu gạch dưới"),

  fullName: z
    .string()
    .min(2, "Họ tên phải có ít nhất 2 ký tự")
    .max(100, "Họ tên không được quá 100 ký tự")
    .trim(),

  email: z
    .string()
    .regex(EMAIL_REGEX, "Email không hợp lệ")
    .email("Email không hợp lệ"),

  phone: z
    .string()
    .regex(PHONE_REGEX, "Số điện thoại phải có 10 chữ số và bắt đầu bằng số 0"),

  gender: z.enum(["M", "F"], {
    errorMap: () => ({ message: "Vui lòng chọn giới tính" }),
  }),

  birthday: z
    .string()
    .min(1, "Vui lòng chọn ngày sinh")
    .refine(
      (date) => isAgeInRange(date, 18, 65),
      "Tuổi phải từ 18 đến 65"
    ),

  // Organization
  roleId: z.string().min(1, "Vui lòng chọn vai trò"),

  departmentId: z.string().min(1, "Vui lòng chọn phòng ban"),

  positionId: z.string().min(1, "Vui lòng chọn vị trí"),

  manageByUserId: z.string().optional(),

  levelSalaryId: z.string().min(1, "Vui lòng chọn cấp bậc lương"),

  // Personal Information
  nation: z.string().optional(),

  nationality: z.string().optional().default("Việt Nam"),

  marriedStatus: z.string().optional(),

  militaryStatus: z.string().optional(),

  // Identity Documents
  citizenIdentityCard: z
    .string()
    .regex(CITIZEN_ID_REGEX, "Số CMND/CCCD phải có 12 chữ số"),

  issueDate: z
    .string()
    .min(1, "Vui lòng chọn ngày cấp")
    .refine(
      (date) => new Date(date) <= new Date(),
      "Ngày cấp không được sau ngày hiện tại"
    ),

  issueAt: z.string().min(1, "Vui lòng nhập nơi cấp"),

  taxCode: z
    .string()
    .optional()
    .refine(
      (val) => !val || TAX_CODE_REGEX.test(val),
      "Mã số thuế phải có từ 10-13 chữ số"
    ),

  identityCardImgFront: z.string().nullable().optional(),

  identityCardImgBack: z.string().nullable().optional(),

  // Address
  permanentAddress: z.string().min(5, "Địa chỉ thường trú phải có ít nhất 5 ký tự"),

  currentAddress: z.string().optional(),

  // Banking
  bankingName: z.string().optional(),

  bankingAccountNo: z.string().optional(),

  bankingAccountName: z.string().optional(),

  // System fields (optional for forms)
  id: z.string().optional(),
  userCode: z.string().optional(),
  faceImg: z.string().nullable().optional(),
  isActive: z.boolean().optional(),
  isRegisterFace: z.boolean().optional(),
  userPushToken: z.string().optional(),
  status: z.string().nullable().optional(),
  reason: z.string().nullable().optional(),
});

/**
 * Type inference from schema
 */
export type UserFormSchemaType = z.infer<typeof userFormSchema>;

/**
 * Schema for update mode (userName not editable)
 */
export const userUpdateFormSchema = userFormSchema.omit({ userName: true });

/**
 * Partial schema for step-by-step validation
 */
export const createStepSchema = (step: number) => {
  switch (step) {
    case 0: // Basic Info
      return userFormSchema.pick({
        userName: true,
        fullName: true,
        email: true,
        phone: true,
        gender: true,
        birthday: true,
      });
    case 1: // Organization
      return userFormSchema.pick({
        roleId: true,
        departmentId: true,
        positionId: true,
        manageByUserId: true,
        levelSalaryId: true,
      });
    case 2: // Personal Info
      return userFormSchema.pick({
        nation: true,
        nationality: true,
        marriedStatus: true,
        militaryStatus: true,
      });
    case 3: // Identity
      return userFormSchema.pick({
        citizenIdentityCard: true,
        issueDate: true,
        issueAt: true,
        taxCode: true,
      });
    case 4: // Address
      return userFormSchema.pick({
        permanentAddress: true,
        currentAddress: true,
      });
    case 5: // Banking
      return userFormSchema.pick({
        bankingName: true,
        bankingAccountNo: true,
        bankingAccountName: true,
      });
    default:
      return userFormSchema;
  }
};
