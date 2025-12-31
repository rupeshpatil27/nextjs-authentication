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
      if (!token.sub) return token;

      const existingUser = await getUserById(token.sub);
      if (!existingUser) return token;

      // const existingAccount = await getAccountByUserId(existingUser.id); // for google,github login

      // token.isOAuth=!!existingAccount   // for google,github login
      token.id = existingUser.id;
      token.name = existingUser.name;
      token.email = existingUser.email;
      token.role = existingUser.role;
      token.isTwoFactorEnabled = existingUser.isTwoFactorEnabled;

      return token;
    },
    async session({ session, token }) {
      if (token) {
        // session.user.isOAuth = token.isOAuth;  // for google,github login
        session.user.isOAuth = false;  // remove this line if google,github login
        session.user.id = token.id;
        session.user.name = token.name;
        session.user.email = token.email;
        session.user.role = token.role;
        session.user.isTwoFactorEnabled = token.isTwoFactorEnabled;
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
