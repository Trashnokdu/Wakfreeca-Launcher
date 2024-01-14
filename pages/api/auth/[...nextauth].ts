import NextAuth from "next-auth"
import Google from "next-auth/providers/google"
require('dotenv').config();
export const clientId = `${process.env.GOOGLE_CLIENT_ID}`;
export const clientSecret = `${process.env.GOOGLE_CLIENT_SECRET}`

const authOptions = { providers: [Google({
   clientId: clientId || "",
   clientSecret: clientSecret || "",
})]}

export default NextAuth(authOptions)