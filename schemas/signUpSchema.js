import { z } from "zod";

const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

export const emailValidation = z
  .string()
  .min(1, "Email is required")
  .max(254, "Email is too long")
  .trim()
  .toLowerCase()
  .email("Invalid email format")
  .regex(emailRegex, "Please enter a valid email address");

export const signUpSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z
    .string()
    .min(1, "Email is required")
    .max(254, "Email is too long")
    .trim()
    .toLowerCase()
    .email("Invalid email format")
    .regex(emailRegex, "Please enter a valid email address"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(100, "Password is too long") // Prevents ReDoS attacks
    .regex(/[A-Z]/, "Include at least one uppercase letter")
    .regex(/[a-z]/, "Include at least one lowercase letter")
    .regex(/[0-9]/, "Include at least one number")
    .regex(/[^A-Za-z0-9]/, "Include at least one special character"),
});
