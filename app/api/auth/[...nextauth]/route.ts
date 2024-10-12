// SignIn API endpoint
import startDB from "@/lib/db";
import UserModel from "@/models/userModel";
import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

import { DefaultUser } from "next-auth";
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
      credentials: {},
      async authorize(credentials, req) {
        const { email, password } = credentials as {
          email: string;
          password: string;
        };
        await startDB();

        const user = await UserModel.findOne({ email });
        if (!user) throw Error("User not found!");

        const passwordMatch = await user.comparePassword(password);
        if (!passwordMatch) throw Error("Email/Password mismatch!");

        return {
          email: user.email,
          role: user.role,
          id: user._id,
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
