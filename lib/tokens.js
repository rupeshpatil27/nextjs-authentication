import crypto from "crypto";
import { v4 as uuidv4 } from "uuid";
import dbConnect from "./dbConnect";
import { getVerificationTokenByEmail } from "@/services/verification-token";
import { getPasswordResetTokenByEmail } from "@/services/password-reset-token";
import VerificationModel from "@/model/VerificationModel";
import PasswordResetModel from "@/model/PasswordResetModel";
import { getTwoFactorTokenByEmail } from "@/services/two-factor-token";
import TwoFactorTokenModel from "@/model/twoFactorTokenModel";

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

export const generateTwoFactorToken = async (email) => {
  const token = crypto.randomInt(100000, 1000000).toString();
  const expires = new Date(new Date().getTime() + 5 * 60 * 1000);

  const existingToken = await getTwoFactorTokenByEmail(email);

  if (existingToken) {
    await dbConnect();

    await TwoFactorTokenModel.deleteOne({ _id: existingToken._id });
  }

  const twoFactorToken = await TwoFactorTokenModel.create({
    email,
    token,
    expires,
  });

  return twoFactorToken;
};
