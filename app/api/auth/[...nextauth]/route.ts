// SignIn API endpoint
import UserModel from "@/models/userModel";
import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

import { DefaultUser } from "next-auth";
import startDB from "@/lib/db";
import { getZoomAccessToken, getZoomUser } from "@/lib/auth";
declare module "next-auth" {
  interface User extends DefaultUser {
    role: string;
  }
}

// Create a jwt session and verify user credentials
const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
  },
  providers: [
    CredentialsProvider({
      type: "credentials",
      credentials: {
        code: {},
      },
      async authorize(credentials) {
        const code = credentials?.code;
        if (!code) {
          throw new Error(
            `Credentials missing required "code" property: ${credentials}`,
          );
        }
        const tokenResponse = await getZoomAccessToken(code);
        const userProfile = await getZoomUser(
          tokenResponse.access_token,
          tokenResponse.api_url,
        );
        await startDB();
        let user = await UserModel.findOne({ email: userProfile.email });
        if (!user) {
          user = await UserModel.create({ email: userProfile.email });
        }
        return {
          id: user.id,
          email: user.email,
          role: user.role,
        };
      },
    }),
  ],
  callbacks: {
    jwt({ user, token }) {
      if (user?.role) {
        token.role = user.role;
        token.id = user.id;
      }
      // reutrn final_token
      return token;
    },
    session({ session, token }) {
      if (session.user) {
        (session.user as { id: string }).id = token.id as string;
        (session.user as { role: string }).role = token.role as string;
      }
      return session;
    },
  },
};

const authHandler = NextAuth(authOptions);

export { authHandler as GET, authHandler as POST };
