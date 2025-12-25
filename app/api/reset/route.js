import dbConnect from "@/lib/dbConnect";
import { sendPasswordResetEmail } from "@/helpers/sendPasswordResetEmail";
import { generatePasswordResetToken } from "@/lib/tokens";
import { resetSchema } from "@/schemas/resetSchema";

import { getUserByEmail } from "@/services/user";

export async function POST(request) {
  try {
    await dbConnect();

    const body = await request.json();
    const result = resetSchema.safeParse(body);
    if (!result.success) {
      return Response.json(
        {
          success: false,
          message: "Please provide a valid email address.",
        },
        { status: 400 }
      );
    }

    const { email } = result.data;

    const existingUser = await getUserByEmail(email);

    if (!existingUser) {
      return Response.json(
        { success: false, message: "No account found with that email." },
        { status: 400 }
      );
    }

    const passwordResetToken = await generatePasswordResetToken(email);

    const emailRes = await sendPasswordResetEmail({
      email: passwordResetToken.email,
      name: existingUser.name,
      token: passwordResetToken.token,
    });

    if (!emailRes.success) {
      return Response.json(
        {
          success: true,
          message: "Failed to send reset email. Please try again in a moment.",
        },
        { status: 201 }
      );
    }

    return Response.json(
      {
        success: true,
        message: "Password reset instructions sent to your email.",
      },
      { status: 201 }
    );
  } catch (error) {
    console.log(error);
    return Response.json(
      {
        success: false,
        message: "An internal server error occurred.",
      },
      { status: 500 }
    );
  }
}
