import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";

import { signInSchema } from "./schemas/signInSchema";
import { getUserByEmail } from "./services/user";
import dbConnect from "./lib/dbConnect";

export default {
  providers: [
    Credentials({
      async authorize(credentials) {
        const result = signInSchema.safeParse(credentials);
        if (result.success) {
          const { email, password } = result.data;

          await dbConnect();
          const existingUser = await getUserByEmail(email);
          if (!existingUser || !existingUser.email || !existingUser.password) {
            return null;
          }

          const isPasswordCorrect = await bcrypt.compare(
            password,
            existingUser.password
          );

          if (isPasswordCorrect) {
            return {
              id: existingUser._id.toString(),
              email: existingUser.email,
              role: existingUser.role,
              name: existingUser.name,
              isTwoFactorEnabled: existingUser.isTwoFactorEnabled,
            };
          }
        }
        return null;
      },
    }),
  ],
};
