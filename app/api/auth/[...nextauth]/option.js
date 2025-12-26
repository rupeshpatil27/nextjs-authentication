import CredentialsProvider from "next-auth/providers/credentials";
import dbConnect from "@/lib/dbConnect";
import bcrypt from "bcryptjs";
import { signInSchema } from "@/schemas/signInSchema";
import { getUserByEmail, getUserById } from "@/services/user";
import {
  generateTwoFactorToken,
  generateVerificationToken,
} from "@/lib/tokens";
import { sendVerificationEmail } from "@/helpers/sendVerificationEmail";
import { getTwoFactorConfirmationByUserId } from "@/services/two-factor-confirmation";
import TwoFactorConfirmationModel from "@/model/twoFactorConfirmationModel";
import { sendTwoFactorTokenEmail } from "@/helpers/sendTwoFactorTokenEmail";
import { getTwoFactorTokenByEmail } from "@/services/two-factor-token";
import TwoFactorTokenModel from "@/model/twoFactorTokenModel";

export const authoption = {
  providers: [
    CredentialsProvider({
      id: "credentials",
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "text ", placeholder: "xxx@xx.xx" },
        password: { label: "Password", type: "password" },
        code: { label: "Two Factor Code", type: "text" },
      },
      async authorize(credentials) {
        const result = signInSchema.safeParse(credentials);

        if (!result.success) {
          throw new Error("Invalid fields!");
        }

        const { email, password, code } = result.data;

        await dbConnect();
        const existingUser = await getUserByEmail(email);
        if (!existingUser || !existingUser.email || !existingUser.password) {
          throw new Error("InvalidCredentials");
        }

        const isPasswordCorrect = await bcrypt.compare(
          password,
          existingUser.password
        );

        if (!isPasswordCorrect) throw new Error("InvalidCredentials");

        if (!existingUser.emailVerified) {
          const verificationToken = await generateVerificationToken(
            existingUser.email
          );

          const emailResponse = await sendVerificationEmail({
            email: existingUser.email,
            name: existingUser.name,
            token: verificationToken.token,
          });

          if (!emailResponse.success) {
            throw new Error("Email provider down. Try again later.");
          }

          throw new Error("VerificationEmailSent");
        }

        if (existingUser.isTwoFactorEnabled && existingUser.email) {
          if (code) {
            const twoFactorToken = getTwoFactorTokenByEmail(existingUser.email);

            if (!twoFactorToken) {
              throw new Error("InvalidCode");
            }

            if (twoFactorToken.token !== code) {
              throw new Error("InvalidCode");
            }

            const hasExpired = new Date(twoFactorToken.expires) < new Date();

            if (hasExpired) {
              throw new Error("ExpiredCode");
            }

            await TwoFactorTokenModel.deleteOne({ _id: twoFactorToken._id });

            const existingConfirmation = await getTwoFactorConfirmationByUserId(
              existingUser._id
            );

            if (existingConfirmation) {
              await TwoFactorConfirmationModel.deleteOne({
                _id: existingUser._id,
              });
            }

            await TwoFactorConfirmationModel.create({
              userId:existingUser._id,
            });
          } else {
            const twoFactorToken = await generateTwoFactorToken(
              existingUser.email
            );

            const emailResponse = await sendTwoFactorTokenEmail({
              email: twoFactorToken.email,
              name: existingUser.name,
              token: twoFactorToken.token,
            });

            if (!emailResponse.success) {
              throw new Error("Email provider down. Try again later.");
            }

            throw new Error("2FAEmailSent");
          }
        }

        return {
          id: existingUser._id.toString(),
          email: existingUser.email,
          role: existingUser.role,
          name: existingUser.name,
        };
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

        await TwoFactorConfirmationModel.deleteOne({ _id: existingUser._id });
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
