"use server";

import VerificationEmail from "@/emails/VerificationEmail";
import { resend } from "@/lib/resend";

export async function sendVerificationEmail({email, name, verifyCode}) {
  try {

    const { data, error } = await resend.emails.send({
      from: "onboarding@resend.dev",
      to: email,
      subject: "Verification Code",
      react: <VerificationEmail name={name} otp={verifyCode} />,
    });

    if (error) {
      return Response.json({ error }, { status: 500 });
    }

    return { success: true, message: "Verification email sent successfully." };
  } catch (emailError) {
    console.error("Error sending verification email:", emailError);
    return { success: false, message: "Failed to send verification email." };
  }
}
