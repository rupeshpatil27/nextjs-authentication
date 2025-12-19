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
