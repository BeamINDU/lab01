import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { validateLogin } from "@/app/libs/services/user-permissions";
import { getPermissions } from "@/app/libs/services/user-permissions"
import { User } from "@/app/types/user-permissions";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },  
      },
      async authorize(credentials, req) {
        if (!credentials?.username || !credentials?.password) return null;

        const user = await validateLogin(credentials.username, credentials.password) as User;

        if (!user) return null;

        return user;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user && typeof user === "object") {
        token.userid = (user as any).userid;
        token.fullname = (user as any).fullname;
        token.email = (user as any).email;

        // const permissions = await getPermissions((user as any).userid);
        // token.permissions = permissions;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.userid = token.userid as string;
        session.user.fullname = token.fullname as string;
        session.user.email = token.email as string;

        // session.user.permissions = token.permissions;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
    maxAge: 60 * 60 * 8, // 8 ชั่วโมง
  },
  secret: process.env.NEXTAUTH_SECRET ?? "",
};
