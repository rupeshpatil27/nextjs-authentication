"use server";
import { getUserByEmail } from "@/services/user";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/userModel";
import { getVerificationTokenByToken } from "@/services/verification-token";
import VerificationModel from "@/model/VerificationModel";

export const newVerification = async (values) => {
  if (!values) {
    return { error: "Token required." };
  }

  try {
    await dbConnect();

    const existingToken = await getVerificationTokenByToken(values);

    if (!existingToken) {
      return { error: "Token does not exist." };
    }

    const hasExpired = new Date(existingToken.expires) < new Date();

    if (hasExpired) {
      return { error: "Token has expired." }
    }

    const existingUser = await getUserByEmail(existingToken.email);

    if (!existingUser) {
      return { error: "Email does not exist." }
    }

    await UserModel.findByIdAndUpdate(existingUser.id, {
      $set: { emailVerified: new Date(), email: existingToken.email },
    });

    await VerificationModel.findByIdAndDelete({ _id: existingToken._id });

    return { success: "Email verified successfully." }
  } catch (error) {
    throw new Error("An internal error occurred during verification.")
  }
};
