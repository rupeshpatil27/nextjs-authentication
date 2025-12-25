import { v4 as uuidv4 } from "uuid";
import dbConnect from "./dbConnect";
import { getVerificationTokenByEmail } from "@/services/verification-token";
import { getPasswordResetTokenByEmail } from "@/services/password-reset-token";
import VerificationModel from "@/model/VerificationModel";
import PasswordResetModel from "@/model/PasswordResetModel";

export const generateVerificationToken = async (email) => {
  const token = uuidv4();

  const expires = new Date(new Date().getTime() + 3600 * 1000);

  const existingToken = await getVerificationTokenByEmail(email);

  if (existingToken) {
    await dbConnect();

    await VerificationModel.deleteOne({ _id: existingToken._id });
  }

  const VerificationToken = await VerificationModel.create({
    email,
    token,
    expires,
  });

  return VerificationToken;
};

export const generatePasswordResetToken = async (email) => {
  const token = uuidv4();

  const expires = new Date(new Date().getTime() + 3600 * 1000);

  const existingToken = await getPasswordResetTokenByEmail(email);

  if (existingToken) {
    await dbConnect();

    await PasswordResetModel.deleteOne({ _id: existingToken._id });
  }

  const POSTasswordReset = await PasswordResetModel.create({
    email,
    token,
    expires,
  });

  return POSTasswordReset;
};
