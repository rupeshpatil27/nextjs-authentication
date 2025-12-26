import dbConnect from "@/lib/dbConnect";
import TwoFactorConfirmationModel from "@/model/twoFactorConfirmationModel";

export const getTwoFactorConfirmationByUserId = async (userId) => {
  try {
    await dbConnect();
    const twoFactorConfirmation = await TwoFactorConfirmationModel.findOne({
      userId,
    });

    return twoFactorConfirmation;
  } catch (error) {
    return null;
  }
};
