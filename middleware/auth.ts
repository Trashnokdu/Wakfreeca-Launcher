import clientId from "@/pages/api/auth/[...nextauth]";
import clientSecret from "@/pages/api/auth/[...nextauth]";
import NextAuth from "next-auth"
import Google from "next-auth/providers/google"
require('dotenv').config();

export const { handlers, auth } = NextAuth({ providers: [Google({
  clientId: clientId || "",
  clientSecret: clientSecret || "",
})]})
