import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import dotenv from "dotenv";
import dbConnect from "../../../utils/dbConnect";
import User from "../../../models/User";

dotenv.config();

export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
  },
  callbacks: {
    session: async function ({ session, user, token }) {
      await dbConnect();
      const userInformation = await User.findOne({
        email: session.user?.email,
      }).exec();
      userInformation.password = "";

      return userInformation;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    CredentialsProvider({
      name: "Login",
      type: "credentials",
      credentials: {
        email: {
          label: "Email",
          type: "email",
          placeholder: "Enter your email",
        },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, req) {
        const response = await fetch("http://localhost:3000/api/user/login", {
          method: "POST",
          body: JSON.stringify({
            email: credentials?.email,
            password: credentials?.password,
          }),
          headers: { "Content-Type": "application/json" },
        });

        const user = await response.json();
        if (!response.ok || !user) return null;

        return {
          id: user.body.userId,
          name: `${user.body.firstName} ${user.body.lastName}`,
          email: user.body.email,
        };
      },
    }),
  ],
};
export default NextAuth(authOptions);
