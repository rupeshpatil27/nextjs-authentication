import dbConnect from "@/lib/dbConnect";
import PasswordResetModel from "@/model/PasswordResetModel";

export const getPasswordResetTokenByEmail = async (email) => {
  try {
    await dbConnect();
    const passwordToken = await PasswordResetModel.findOne({ email });

    return passwordToken;
  } catch (error) {
    return null;
  }
};

export const getPasswordResetTokenByToken = async (token) => {
  try {
    await dbConnect();
    const passwordToken = await PasswordResetModel.findOne({ token });

    return passwordToken;
  } catch (error) {
    return null;
  }
};
