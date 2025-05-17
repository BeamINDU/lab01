import NextAuth from "next-auth";
import type { UserPermission } from "@/app/types/user-permissions"

declare module "next-auth" {
  interface Session {
    user: {
      userid: string;
      fullname: string;
      email: string;
      permissions: UserPermission[];
    };
  }

  interface User {
    userid: string;
    fullname: string;
    email: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    userid: string;
    fullname: string;
    email: string;
    permissions: UserPermission[];
  }
}
