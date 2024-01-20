import NextAuth from "next-auth"
import Google from "next-auth/providers/google"
require('dotenv').config();
export const clientId = `${process.env.GOOGLE_CLIENT_ID}`;
export const clientSecret = `${process.env.GOOGLE_CLIENT_SECRET}`
export const Secret = `${process.env.Secret}`

const authOptions = { providers: [Google({
   clientId: clientId || "",
   clientSecret: clientSecret || "",
})],
secret: Secret
}

export default NextAuth(authOptions)