"use server";

import { signIn } from "next-auth/react";
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

export const signin = async (values) => {
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
        error: "We're having trouble sending emails. Please try again later.",
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
    const result = await signIn("credentials", {
      redirect: false,
      email,
      password,
    });
  } catch (error) {
    // switch (error.type) {
    //   case "CredentialsSignin":
    //     return { error: "InvalidCredentials" };

    //   default:
    //     return { error: "GENERIC_ERROR" };
    // }
    throw new Error(error);
  }
};
