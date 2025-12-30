"use server";
import bcrypt from "bcryptjs";
import { AuthError } from "next-auth";
import { sendVerificationEmail } from "@/helpers/sendVerificationEmail";
import {
  generateTwoFactorToken,
  generateVerificationToken,
} from "@/lib/tokens";
import TwoFactorConfirmationModel from "@/model/twoFactorConfirmationModel";
import TwoFactorTokenModel from "@/model/twoFactorTokenModel";
import { signInSchema } from "@/schemas/signInSchema";
import { getTwoFactorConfirmationByUserId } from "@/services/two-factor-confirmation";
import { getTwoFactorTokenByEmail } from "@/services/two-factor-token";
import { getUserByEmail } from "@/services/user";
import dbConnect from "@/lib/dbConnect";
import { DEFAULT_LOGIN_REDIRECT } from "@/routes";
import { signIn } from "@/auth";
import { sendTwoFactorTokenEmail } from "@/helpers/sendTwoFactorTokenEmail";

export const login = async (values) => {
  const result = signInSchema.safeParse(values);

  if (!result.success) {
    return { error: "Invalid email or password." };
  }

  const { email, password, code } = result.data;

  await dbConnect();

  const existingUser = await getUserByEmail(email);
  if (!existingUser || !existingUser.email || !existingUser.password) {
    return { error: "Invalid email or password." };
  }

  const isPasswordCorrect = await bcrypt.compare(
    password,
    existingUser.password
  );

  if (!isPasswordCorrect) {
    return { error: "Invalid email or password." };
  }

  if (!existingUser.emailVerified) {
    const verificationToken = await generateVerificationToken(
      existingUser.email
    );

    const emailResponse = await sendVerificationEmail({
      email: existingUser.email,
      name: existingUser.name,
      token: verificationToken.token,
    });

    if (!emailResponse.success) {
      return {
        error:
          "We're having trouble sending verification email emails. Please try again later.",
      };
    }

    return {
      success: "A verification link has been sent.",
    };
  }

  if (existingUser.isTwoFactorEnabled && existingUser.email) {
    if (code) {
      const twoFactorToken = await getTwoFactorTokenByEmail(existingUser.email);

      if (!twoFactorToken) {
        return {
          error:
            "The security code is incorrect. Please check the code and try again.",
        };
      }

      if (twoFactorToken.token !== code) {
        return {
          error:
            "The security code is incorrect. Please check the code and try again.",
        };
      }

      const hasExpired = new Date(twoFactorToken.expires) < new Date();

      if (hasExpired) {
        return { error: "This code has expired. Please request a new one." };
      }

      await TwoFactorTokenModel.deleteOne({ _id: twoFactorToken._id });

      const existingConfirmation = await getTwoFactorConfirmationByUserId(
        existingUser._id
      );

      if (existingConfirmation) {
        await TwoFactorConfirmationModel.deleteOne({
          _id: existingConfirmation._id,
        });
      }

      await TwoFactorConfirmationModel.create({
        userId: existingUser._id,
      });
    } else {
      const twoFactorToken = await generateTwoFactorToken(existingUser.email);

      const emailResponse = await sendTwoFactorTokenEmail({
        email: twoFactorToken.email,
        name: existingUser.name,
        token: twoFactorToken.token,
      });

      if (!emailResponse.success) {
        throw new Error(
          "We're having trouble sending emails. Please try again later."
        );
      }

      return {
        success: "A security code has been sent to your email.",
        twoFactor: true,
      };
    }
  }

  try {
    await signIn("credentials", {
      email,
      password,
      redirectTO: DEFAULT_LOGIN_REDIRECT,
    });
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return { error: "Invalid credentials!" };
        case "AccessDenied":
          return { error: "Please verify your email first." };
        default:
          return { error: "Something went wrong." };
      }
    }

    throw error;
  }
};
