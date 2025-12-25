"use server";

import PasswordResetEmail from "@/emails/PasswordResetEmail";
import { resend } from "@/lib/resend";

export async function sendPasswordResetEmail({ email, name, token }) {
  if (!email || !token) {
    return { success: false, error: "Missing email or token" };
  }

  try {
    const { data, error } = await resend.emails.send({
      from: "onboarding@resend.dev",
      to: email,
      subject: "Reset your password",
      react: <PasswordResetEmail name={name} token={token} />,
    });

    if (error) {
      console.error("Resend Error:", error);
      return { success: false, message: error.message };
    }

    return { success: true, message: "Reset link sent to your email." };
  } catch (emailError) {
    console.error("Password Reset Email Error:", emailError);
    return { success: false, message: "Failed to send reset email." };
  }
}
