"use server";

import VerificationEmail from "@/emails/VerificationEmail";
import { resend } from "@/lib/resend";

export async function sendVerificationEmail({ email, name, token }) {
  try {
    const { data, error } = await resend.emails.send({
      from: "onboarding@resend.dev",
      to: email,
      subject: "Confirm your email",
      react: <VerificationEmail name={name} token={token} />,
    });

    if (error) {
      console.error("Resend Error:", error);
      return { success: false, message: error.message };
    }

    return { success: true, message: "Verification email sent successfully." };
  } catch (emailError) {
    console.error("Error sending verification email:", emailError);
    return { success: false, message: "Failed to send verification email." };
  }
}
