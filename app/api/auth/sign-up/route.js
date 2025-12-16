import { sendVerificationEmail } from "@/helpers/sendVerificationEmail";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/userModel";

import bcrypt from "bcryptjs";

export async function POST(req) {
  await dbConnect();
  const { name, email, password } = await req.json();

  try {
    const existingUserVerifiedByEmail = await UserModel.findOne({
      email,
      isVerified: true,
    });

    if (existingUserVerifiedByEmail) {
      return Response.json(
        { success: false, message: "User with this email already exists." },
        { status: 422 }
      );
    }

    const existingUserByEmail = await UserModel.findOne({
      email,
    });

    const verifyCode = Math.floor(100000 + Math.random() * 900000).toString();

    if (existingUserByEmail) {
      //hjhjhj
    } else {
      const hashPassword = await bcrypt.hash(password, 10);

      const expiryDate = new Date();
      expiryDate.setHours(expiryDate.getHours() + 1);

      const newUser = await UserModel({
        name,
        email,
        password: hashPassword,
        verifyCode,
        verifyCodeExpiry: expiryDate,
        isVerified: false,
      });

      await newUser.create();
    }

    const emailResponse = await sendVerificationEmail({
      email,
      username: name,
      verifyCode,
    });

    if (!emailResponse.success) {
      return Response.json(
        { success: false, message: emailResponse.message },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "User created successfully. Please verify email",
      },
      { status: 201 }
    );
  } catch (error) {
    console.log("Error in registering user", error);

    return Response.json(
      { success: false, message: "Error in registering user" },
      { status: 500 }
    );
  }
}
