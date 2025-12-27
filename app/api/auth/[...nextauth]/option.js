import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import dbConnect from "@/lib/dbConnect";
import { signInSchema } from "@/schemas/signInSchema";
import { getUserByEmail, getUserById } from "@/services/user";
import { getTwoFactorConfirmationByUserId } from "@/services/two-factor-confirmation";
import TwoFactorConfirmationModel from "@/model/twoFactorConfirmationModel";

export const authoption = {
  providers: [
    CredentialsProvider({
      id: "credentials",
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "text ", placeholder: "xxx@xx.xx" },
        password: { label: "Password", type: "password" },
      },
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
            };
          }
        }
        return null;
      },
    }),
  ],

  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider !== "credentials") return true;

      const existingUser = await getUserById(user.id);

      if (!existingUser.emailVerified) return false;

      if (existingUser.isTwoFactorEnabled) {
        const twoFactorConfirmation = await getTwoFactorConfirmationByUserId(
          existingUser._id
        );

        if (!twoFactorConfirmation) return false;

        await TwoFactorConfirmationModel.deleteOne({ _id: twoFactorConfirmation._id });
      }

      return true; // Allow sign-in
    },

    async jwt({ token, user }) {
      if (user) {
        token.id = user._id?.toString();
        token.role = user.role;
      }

      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id;
        session.user.role = token.role;
      }

      return session;
    },
  },
  pages: {
    signIn: "/sign-in",
    error: "/error",
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
};
