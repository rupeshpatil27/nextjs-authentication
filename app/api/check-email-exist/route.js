import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/userModel";
import { emailValidation } from "@/schemas/signUpSchema";
import { NextResponse } from "next/server";
import { z } from "zod";

const usernameQuerySchema = z.object({
  email: emailValidation,
});

export async function GET(request) {
  await dbConnect();

  try {
    const { searchParams } = new URL(request.url);

    const queryParams = { email: searchParams.get("email") };

    const result = usernameQuerySchema.safeParse(queryParams);

    if (!result.success) {
      const emailErrors = result.error.format().email?._errors || [];

      return NextResponse.json(
        {
          success: false,
          message:
            emailErrors?.length > 0
              ? emailErrors.join(", ")
              : "Error checking email.",
        },
        { status: 400 }
      );
    }

    const { email } = result.data;

    const existingUser = await UserModel.findOne({ email });

    if (existingUser) {
      return NextResponse.json(
        { success: false, message: "Email already exists." },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: true, message: "Email not found." },
      { status: 200 }
    );
  } catch (error) {
    console.log("Error checking email.", error);

    return NextResponse.json(
      { success: false, message: "Error checking email." },
      { status: 500 }
    );
  }
}
