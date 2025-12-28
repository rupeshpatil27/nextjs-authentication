import NextAuth from "next-auth";
import authConfig from "./auth.config";
import { getUserById } from "./services/user";
import { getTwoFactorConfirmationByUserId } from "./services/two-factor-confirmation";
import TwoFactorConfirmationModel from "./model/twoFactorConfirmationModel";

export const { handlers, auth, signIn, signOut } = NextAuth({
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

        await TwoFactorConfirmationModel.deleteOne({
          _id: twoFactorConfirmation._id,
        });
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
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/sign-in",
    error: "/error",
  },
  secret: process.env.AUTH_SECRET,
  ...authConfig,
});
