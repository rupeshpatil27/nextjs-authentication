"use server";

import bcrypt from "bcryptjs";

import { sendVerificationEmail } from "@/helpers/sendVerificationEmail";
import { generateVerificationToken } from "@/lib/tokens";
import { getUserByEmail } from "@/services/user";
import dbConnect from "@/lib/dbConnect";
import { signUpSchema } from "@/schemas/signUpSchema";
import UserModel from "@/model/userModel";

export const signup = async (values) => {
  const result = signUpSchema.safeParse(values);

  if (!result.success) {
    return { error: "Invalid field." };
  }

  const { name, email, password } = result.data;

  try {
    await dbConnect();

    const existingUser = await getUserByEmail(email);
    if (existingUser) {
      return { error: "Account already exists." };
    }

    const hashPassword = await bcrypt.hash(password, 10);

    const newUser = await UserModel({
      name,
      email,
      password: hashPassword,
    });

    await newUser.save();

    const verificationToken = await generateVerificationToken(email);

    const emailRes = await sendVerificationEmail({
      email,
      name,
      token: verificationToken.token,
    });

    if (!emailRes.success) {
      return {
        error:
          "Account created, but failed to send verification email. Please try logging in to resend.",
      };
    }

    return {
      success: "Email Send!, Please verify your email.",
    };
  } catch (error) {
    throw new Error(
      "We encountered an issue creating your account. Please try again later."
    );
  }
};
