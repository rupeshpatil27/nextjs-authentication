"use server";
import { getUserByEmail } from "@/services/user";
import dbConnect from "@/lib/dbConnect";
import { resetSchema } from "@/schemas/resetSchema";
import { generatePasswordResetToken } from "@/lib/tokens";
import { sendPasswordResetEmail } from "@/helpers/sendPasswordResetEmail";

export const reset = async (values) => {
  const result = resetSchema.safeParse(values);
  if (!result.success) {
    return {
      error: "Please provide a valid email address.",
    };
  }

  const { email } = result.data;

  try {
    await dbConnect();

    const existingUser = await getUserByEmail(email);

    if (!existingUser) {
      return {
        error: "No account found with that email.",
      };
    }

    const passwordResetToken = await generatePasswordResetToken(email);

    const emailRes = await sendPasswordResetEmail({
      email: passwordResetToken.email,
      name: existingUser.name,
      token: passwordResetToken.token,
    });

    if (!emailRes.success) {
      return {
        error: "Failed to send reset email. Please try again in a moment.",
      };
    }

    return {
      success: "Password reset instructions sent to your email.",
    };
  } catch (error) {
    throw new Error("An internal server error occurred.");
  }
};
