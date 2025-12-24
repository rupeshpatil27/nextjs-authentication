import dbConnect from "@/lib/dbConnect";
import VerificationModel from "@/model/VerificationModel";

export const getVerificationTokenByEmail = async (email) => {
  try {
    await dbConnect();
    const verificationToken = await VerificationModel.findOne({ email });

    return verificationToken;
  } catch (error) {
    return null;
  }
};

export const getVerificationTokenByToken = async (token) => {
  try {
    await dbConnect();
    const verificationToken = await VerificationModel.findOne({ token });

    return verificationToken;
  } catch (error) {
    return null;
  }
};
