"use server";
import bcrypt from "bcryptjs";
import { sendVerificationEmail } from "@/helpers/sendVerificationEmail";
import { currentUser } from "@/lib/auth";
import dbConnect from "@/lib/dbConnect";
import { generateVerificationToken } from "@/lib/tokens";
import UserModel from "@/model/userModel";
import { getUserByEmail, getUserById } from "@/services/user";
import { settingSchema } from "@/schemas/settingSchema";

export const settings = async (values) => {
  const user = await currentUser();

  if (!user) {
    return { error: "Unauthorized." };
  }

  const validatedFields = settingSchema.safeParse(values);
  if (!validatedFields.success) {
    return { error: "Invalid fields!" };
  }

  let { email, password, newPassword, ...otherValues } = validatedFields.data;

  try {
    await dbConnect();

    const dbUser = await getUserById(user.id);

    if (!dbUser) {
      return { error: "Unauthorized." };
    }

    if (user.isOAuth) {
      email = undefined;
      password = undefined;
      newPassword = undefined;
      otherValues.isTwoFactorEnabled = undefined;
    }

    if (email && email !== user.email) {
      const existingUser = await getUserByEmail(email);

      if (existingUser && existingUser._id.toString() !== user.id) {
        return { error: "Email already in use." };
      }

      const verificationToken = await generateVerificationToken(email);

      const emailRes = await sendVerificationEmail({
        email: verificationToken.email,
        name: user.name || "User",
        token: verificationToken.token,
      });

      if (!emailRes.success) {
        return {
          error: "Failed to send verification email",
        };
      }

      return { success: "Verification email sent!" };
    }

    let updatePayload = { ...otherValues };

    if (password && newPassword && dbUser.password) {
      const isPasswordmatch = await bcrypt.compare(password, dbUser.password);

      if (!isPasswordmatch) {
        return { error: "Incorrect password." };
      }

      const hashedPassword = await bcrypt.hash(newPassword, 10);

      updatePayload.password = hashedPassword;
    }

    await UserModel.findByIdAndUpdate(dbUser.id, {
      $set: updatePayload,
    });

    return { success: "Settings updated successfully." };
  } catch (error) {
    console.error("[SETTINGS_ACTION_ERROR]:", error);
    return { error: "An internal error occurred." };
  }
};
