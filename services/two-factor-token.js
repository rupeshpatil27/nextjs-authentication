import dbConnect from "@/lib/dbConnect";
import TwoFactorTokenModel from "@/model/twoFactorTokenModel";

export const getTwoFactorTokenByEmail = async (email) => {
  try {
    await dbConnect();
    const twoFactorToken = await TwoFactorTokenModel.findOne({ email });

    return twoFactorToken;
  } catch (error) {
    return null;
  }
};

export const getTwoFactorTokenByToken = async (token) => {
  try {
    await dbConnect();
    const twoFactorToken = await TwoFactorTokenModel.findOne({ token });

    return twoFactorToken;
  } catch (error) {
    return null;
  }
};
