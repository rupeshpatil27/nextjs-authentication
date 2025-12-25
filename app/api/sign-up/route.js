import { sendVerificationEmail } from "@/helpers/sendVerificationEmail";
import dbConnect from "@/lib/dbConnect";
import { generateVerificationToken } from "@/lib/tokens";
import UserModel from "@/model/userModel";

import { signUpSchema } from "@/schemas/signUpSchema";
import { getUserByEmail } from "@/services/user";

import bcrypt from "bcryptjs";

export async function POST(request) {
  try {
    await dbConnect();

    const body = await request.json();
    const result = signUpSchema.safeParse(body);
    if (!result.success) {
      return Response.json(
        {
          success: false,
          message: result.error.issues[0]?.message,
        },
        { status: 400 }
      );
    }

    const { name, email, password } = result.data;

    const existingUser = await getUserByEmail(email);

    if (existingUser) {
      return Response.json(
        { success: false, message: "Email already exists." },
        { status: 400 }
      );
    }

    const hashPassword = await bcrypt.hash(password, 10);

    const newUser = await UserModel({
      name,
      email,
      password: hashPassword,
    });

    await newUser.save();

    const verificationToken = await generateVerificationToken(email);

    const emailRes = await sendVerificationEmail({
      email,
      name,
      token: verificationToken.token,
    });

    if (!emailRes.success) {
      return Response.json(
        {
          success: true,
          message:
            "Account created, but failed to send verification email. Please try logging in to resend.",
        },
        { status: 201 }
      );
    }

    return Response.json(
      {
        success: true,
        message: "Email Send!, Please verify your email.",
      },
      { status: 201 }
    );
  } catch (error) {
    console.log(error);
    return Response.json(
      {
        success: false,
        message:
          "We encountered an issue creating your account. Please try again later.",
      },
      { status: 500 }
    );
  }
}

// export async function POST(request) {
//   await dbConnect();
//   const { name, email, password } = await request.json();

//   try {
//     if (!name) {
//       return NextResponse.json(
//         { success: false, message: "Name is required!" },
//         { status: 400 }
//       );
//     }

//     if (!email) {
//       return NextResponse.json(
//         { success: false, message: "Email is required!" },
//         { status: 400 }
//       );
//     }

//     if (!password) {
//       return NextResponse.json(
//         { success: false, message: "Password is required!" },
//         { status: 400 }
//       );
//     }

//     const verifyCode = Math.floor(100000 + Math.random() * 900000).toString();

//     const existingUserByEmail = await UserModel.findOne({
//       email,
//     });

//     if (existingUserByEmail) {
//       if (existingUserByEmail.isVerified) {
//         return NextResponse.json(
//           { success: false, message: "User with this email already exists." },
//           { status: 422 }
//         );
//       } else {
//         const hashPassword = await bcrypt.hash(password, 10);
//         existingUserByEmail.password = hashPassword;
//         existingUserByEmail.verifyCode = verifyCode;
//         existingUserByEmail.expiryDate = new Date(Date.now() + 3600000);

//         await existingUserByEmail.save();
//       }
//     } else {
//       const hashPassword = await bcrypt.hash(password, 10);

//       const expiryDate = new Date();
//       expiryDate.setHours(expiryDate.getHours() + 1);

//       const newUser = await UserModel({
//         name,
//         email,
//         password: hashPassword,
//         verifyCode,
//         verifyCodeExpiry: expiryDate,
//         isVerified: false,
//       });

//       await newUser.save();
//     }

//     const emailResponse = await sendVerificationEmail({
//       email,
//       name,
//       verifyCode,
//     });

//     if (!emailResponse.success) {
//       return NextResponse.json(
//         { success: false, message: emailResponse.message },
//         { status: 500 }
//       );
//     }

//     return NextResponse.json(
//       {
//         success: true,
//         message: "User created successfully. Please verify email",
//       },
//       { status: 201 }
//     );
//   } catch (error) {
//     console.log("Error in registering user", error);

//     return NextResponse.json(
//       { success: false, message: "Error in registering user" },
//       { status: 500 }
//     );
//   }
// }
