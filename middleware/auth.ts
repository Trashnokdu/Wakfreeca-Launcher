import NextAuth from "next-auth"
import Google from "next-auth/providers/google"
require('dotenv').config();

export const { handlers, auth } = NextAuth({ providers: [Google({
  clientId: process.env.GOOGLE_CLIENT_ID || "",
  clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
})]})
