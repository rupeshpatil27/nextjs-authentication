"use server";

import VerificationEmail from "@/emails/VerificationEmail";
import { resend } from "@/lib/resend";
import { render } from "@react-email/render";

export async function sendVerificationEmail({email, name, verifyCode}) {
  try {

    const emailHtml = await render(
      <VerificationEmail name={name} otp={verifyCode} />
    );

    const { data, error } = await resend.emails.send({
      from: "onboarding@resend.dev",
      to: email,
      subject: "Verification Code",
      react: emailHtml,
    });

    console.log("data", data);
    console.log("error", error);

    if (error) {
      return Response.json({ error }, { status: 500 });
    }

    return { success: true, message: "Verification email sent successfully." };
  } catch (emailError) {
    console.error("Error sending verification email:", emailError);
    return { success: false, message: "Failed to send verification email." };
  }
}
