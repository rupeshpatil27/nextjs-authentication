import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/userModel";
import { NextResponse } from "next/server";

export async function POST(request) {
  await dbConnect();

  try {
    const { email, code } = await request.json();

    const user = await UserModel.findOne({ email });

    if (!user) {
      return NextResponse.json(
        { success: false, message: "User not found." },
        { status: 400 }
      );
    }

    const isCodeValid = user.verifyCode === code;
    const isCodeNotExpired = new Date(user.verifyCodeExpiry > new Date());

    if (isCodeValid && isCodeNotExpired) {
      user.isVerified = true;

      await user.save();

      return NextResponse.json(
        { success: true, message: "Account verified successfully." },
        { status: 200 }
      );
    } else if (!isCodeNotExpired) {
      return NextResponse.json(
        {
          success: false,
          message: "Verification code expired, please sign up again.",
        },
        { status: 400 }
      );
    } else {
      return NextResponse.json(
        { success: false, message: "Incorrect verification code" },
        { status: 400 }
      );
    }
  } catch (error) {
    console.log("Error verifying user", error);

    return NextResponse.json(
      { success: false, message: "Error verifying user" },
      { status: 500 }
    );
  }
}
