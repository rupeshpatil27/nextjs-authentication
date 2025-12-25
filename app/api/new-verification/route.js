import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/userModel";
import VerificationModel from "@/model/VerificationModel";
import { getUserByEmail } from "@/services/user";
import { getVerificationTokenByToken } from "@/services/verification-token";

export async function POST(request) {
  await dbConnect();

  try {
    const { token } = await request.json();

    if (!token) {
      return Response.json(
        { success: false, message: "Token required!" },
        { status: 400 }
      );
    }
    const existingToken = await getVerificationTokenByToken(token);

    if (!existingToken) {
      return Response.json(
        { success: false, message: "Token does not exist!" },
        { status: 400 }
      );
    }

    const hasExpired = new Date(existingToken.expires) < new Date();

    if (hasExpired) {
      return Response.json(
        { success: false, message: "Token has expired!" },
        { status: 400 }
      );
    }

    const existingUser = await getUserByEmail(existingToken.email);

    if (!existingUser) {
      return Response.json(
        { success: false, message: "Email does not exist!" },
        { status: 400 }
      );
    }

    await UserModel.findByIdAndUpdate(existingUser.id, {
      $set: { emailVerified: new Date(), email: existingToken.email },
    });

    await VerificationModel.findByIdAndDelete({ _id: existingToken._id });

    return Response.json(
      { success: true, message: "Email verified successfully." },
      { status: 200 }
    );
  } catch (error) {
    console.log("Error verifying", error);

    return Response.json(
      {
        success: false,
        message: "An internal error occurred during verification.",
      },
      { status: 500 }
    );
  }
}
