import bcrypt from "bcryptjs";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/userModel";
import { newPasswordSchema } from "@/schemas/newPasswordSchema";
import { getPasswordResetTokenByToken } from "@/services/password-reset-token";
import { getUserByEmail } from "@/services/user";
import PasswordResetModel from "@/model/PasswordResetModel";

export async function POST(request) {
  await dbConnect();

  try {
    const body = await request.json();

    if (!body.token) {
      return Response.json(
        { success: false, message: "Token required!" },
        { status: 400 }
      );
    }
    console.log(body);

    const result = newPasswordSchema.safeParse({ password: body.password });

    if (!result.success) {
      return Response.json(
        {
          success: false,
          message: "Invalid password format.",
        },
        { status: 400 }
      );
    }

    const { password } = result.data;
    const { token } = body;

    const existingToken = await getPasswordResetTokenByToken(token);

    if (!existingToken) {
      return Response.json(
        { success: false, message: "Invalid or expired token." },
        { status: 400 }
      );
    }

    const hasExpired = new Date(existingToken.expires) < new Date();

    if (hasExpired) {
      return Response.json(
        {
          success: false,
          message: "Token has expired. Please request a new link.",
        },
        { status: 400 }
      );
    }

    const existingUser = await getUserByEmail(existingToken.email);

    if (!existingUser) {
      return Response.json(
        { success: false, message: "Account no longer exists." },
        { status: 400 }
      );
    }

    const hashPassword = await bcrypt.hash(password, 10);

    await UserModel.findByIdAndUpdate(existingUser.id, {
      $set: { password: hashPassword, email: existingToken.email },
    });

    await PasswordResetModel.findByIdAndDelete({ _id: existingToken._id });

    return Response.json(
      {
        success: true,
        message: "Password updated successfully. You can now log in.",
      },
      { status: 200 }
    );
  } catch (error) {
    console.log("CRITICAL_PASSWORD_RESET_ERROR", error);

    return Response.json(
      {
        success: false,
        message: "Internal server error. Please try again later.",
      },
      { status: 500 }
    );
  }
}
