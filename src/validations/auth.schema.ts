import { z } from "zod";

const usernameSchema = z.string().min(3, "Username must be at least 3 characters").trim();
const emailSchema = z.string().email("Invalid email address").min(1, "Email is required").trim();
const passwordSchema = z.string()
  .min(6, "Password must be at least 6 characters")
  .regex(/^(?=.*[a-zA-Z])(?=.*\d)(?=.*[@#$&])[a-zA-Z0-9@#$&]{6,}$/,
    "Password must be at least 6 characters long and contain at least one letter, one number, and one of @#$& ")
  .trim();

export const loginSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
});

export const registerSchema = z.object({
  username: usernameSchema,
  email: emailSchema,
  password: passwordSchema,
});

export const forgotPasswordSchema = z.object({
  email: emailSchema,
});

export const verifyOtpSchema = z.object({
  email: emailSchema,
  otp: z.string().length(6, "OTP must be 6 digits"),
});

export const resetPasswordSchema = z.object({
  password: passwordSchema,
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

export const updateInfoSchema = z.object({
  username: usernameSchema.optional(),
  email: emailSchema.optional(),
}).refine(data => data.username || data.email, {
  message: "At least one field must be updated",
  path: ["username"],
});

export const changePasswordSchema = z.object({
  oldPassword: passwordSchema,
  newPassword: passwordSchema,
  confirmPassword: z.string(),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

export const taskSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters").max(100, "Title is too long (at most 100 characters)").trim(),
  description: z.string().min(3, "Description must be at least 3 characters").max(500, "Description is too long (at most 500 characters)").trim().optional().or(z.literal("")),
  priority: z.enum(["low", "medium", "high"]),
  tags: z.array(z.string().max(15, "Tag is too long (at most 15 characters)").trim()).max(4, "You can add at most 4 tags").optional(),
  dueDate: z.string().optional().or(z.literal("")),
});

export type LoginFormData = z.infer<typeof loginSchema>;
export type RegisterFormData = z.infer<typeof registerSchema>;
export type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;
export type VerifyOtpFormData = z.infer<typeof verifyOtpSchema>;
export type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;
export type UpdateInfoFormData = z.infer<typeof updateInfoSchema>;
export type ChangePasswordFormData = z.infer<typeof changePasswordSchema>;
export type TaskFormData = z.infer<typeof taskSchema>;
