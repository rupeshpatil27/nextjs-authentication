import { getVerificationTokenByEmail } from "@/services/verification-token";
import { v4 as uuidv4 } from "uuid";
import dbConnect from "./dbConnect";
import VerificationModel from "@/model/VerificationModel";

export const generateVerificationToken = async (email) => {
  const token = uuidv4();

  const expires = new Date(new Date().getTime() + 3600 * 1000);

  const existingToken = await getVerificationTokenByEmail(email);

  if (existingToken) {
    await dbConnect();

    await VerificationModel.deleteOne({ _id: existingToken._id });
  }

  
};
