import { userRole } from "@/constants";
import * as z from "zod";

const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

export const settingSchema = z
  .object({
    name: z.string().min(1, "Name is required").optional().or(z.literal("")),
    isTwoFactorEnabled: z.boolean().optional(),
    role: z.nativeEnum(userRole, {
      errorMap: () => ({ message: "Please select a valid role" }),
    }),
    email: z
      .string()
      .trim()
      .toLowerCase()
      .email("Invalid email format")
      .min(1, "Email is required")
      .max(254, "Email is too long")
      .regex(emailRegex, "Please enter a valid email address")
      .optional()
      .or(z.literal("")),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .max(100, "Password is too long") // Prevents ReDoS attacks
      .regex(/[A-Z]/, "Password must Include at least one uppercase letter")
      .regex(/[a-z]/, "Password must Include at least one lowercase letter")
      .regex(/[0-9]/, "Password must Include at least one number")
      .regex(
        /[^A-Za-z0-9]/,
        "Password must Include at least one special character"
      )
      .optional()
      .or(z.literal("")),
    newPassword: z
      .string()
      .min(8, "New password must be at least 8 characters")
      .max(100, "New password is too long") // Prevents ReDoS attacks
      .regex(/[A-Z]/, "New password must Include at least one uppercase letter")
      .regex(/[a-z]/, "New password must Include at least one lowercase letter")
      .regex(/[0-9]/, "New password must Include at least one number")
      .regex(
        /[^A-Za-z0-9]/,
        "New password must Include at least one special character"
      )
      .optional()
      .or(z.literal("")),
  })
  .refine(
    (data) => {
      if (data.password && !data.newPassword) {
        return false;
      }

      return true;
    },
    {
      message: "New password is required.",
      path: ["newPassword"],
    }
  )
  .refine(
    (data) => {
      if (data.newPassword && !data.password) {
        return false;
      }

      return true;
    },
    {
      message: "Password is required.",
      path: ["password"],
    }
  )
  .refine(
    (data) => {
      if (
        data.password &&
        data.newPassword &&
        data.password === data.newPassword
      ) {
        return false;
      }
      return true;
    },
    {
      message: "New password cannot be the same as current password",
      path: ["newPassword"],
    }
  );
