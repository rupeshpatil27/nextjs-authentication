import * as z from "zod";

export const newPasswordSchema = z.object({
  password: z.string().min(3, "Password must be at least 8 characters"),
});
