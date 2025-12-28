"use server";
import bcrypt from "bcryptjs";
import { getUserByEmail } from "@/services/user";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/userModel";
import { newPasswordSchema } from "@/schemas/newPasswordSchema";
import { getPasswordResetTokenByToken } from "@/services/password-reset-token";
import PasswordResetModel from "@/model/PasswordResetModel";

export const newPassword = async (values) => {
  if (!values.token) {
    return { error: "Token required." };
  }

  const result = newPasswordSchema.safeParse({ password: values.password });

  if (!result.success) {
    return { error: "Invalid password format." };
  }

  const { password } = result.data;
  const { token } = values;
  try {
    await dbConnect();

    const existingToken = await getPasswordResetTokenByToken(token);

    if (!existingToken) {
      return { error: "Invalid or expired token." };
    }

    const hasExpired = new Date(existingToken.expires) < new Date();

    if (hasExpired) {
      return { error: "Token has expired. Please request a new link." };
    }

    const existingUser = await getUserByEmail(existingToken.email);

    if (!existingUser) {
      return { error: "Account no longer exists." };
    }

    const hashPassword = await bcrypt.hash(password, 10);

    await UserModel.findByIdAndUpdate(existingUser.id, {
      $set: { password: hashPassword, email: existingToken.email },
    });

    await PasswordResetModel.findByIdAndDelete({ _id: existingToken._id });

    return { success: "Password updated successfully. You can now log in." };
  } catch (error) {
    throw new Error("Internal server error. Please try again later.");
  }
};
