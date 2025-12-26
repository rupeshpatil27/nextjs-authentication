"use server";

import TwoFactorEmail from "@/emails/TwoFactorEmail";
import { resend } from "@/lib/resend";

export async function sendTwoFactorTokenEmail({ email, name, token }) {
  if (!email)
    return { success: false, message: "Please provide an email address." };
  if (!token)
    return {
      success: false,
      message: "Security token generation failed. Please try again.",
    };
  try {
    const { data, error } = await resend.emails.send({
      from: "onboarding@resend.dev",
      to: email,
      subject: `${token} is your verification code`,
      react: <TwoFactorEmail name={name} otp={token} />,
    });

    if (error) {
      console.error("Resend Error:", error);
      return {
        success: false,
        message: error.message || "Failed to deliver email through provider.",
      };
    }

    return {
      success: true,
      message:
        "Security code sent! If you don't see it, please check your spam folder.",
    };
  } catch (emailError) {
    console.error("Internal Email Service Error:", emailError);
    return {
      success: false,
      message: "An unexpected error occurred while sending the email.",
    };
  }
}
