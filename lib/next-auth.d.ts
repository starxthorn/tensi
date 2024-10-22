import "next-auth";
import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface User {
    _id?: string;
    image?: string;
    name?: string;
    email?: string;
    location?: string;
    phone?: string;
    cnic?: string;
    cnic_picture?: string;
    verified?: "not verified" | "verified" | "pending";
    description?: string;
  }
  interface Session {
    user: {
      _id?: string;
      image?: string;
      name?: string;
      email?: string;
      location?: string;
      phone?: string;
      cnic?: string;
      cnic_picture?: string;
      verified?: "not verified" | "verified" | "pending";
      description?: string;
    } & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    _id?: string;
    image?: string;
    name?: string;
    email?: string;
    location?: string;
    phone?: string;
    cnic?: string;
    cnic_picture?: string;
    verified?: "not verified" | "verified" | "pending";
    description?: string;
  }
}
