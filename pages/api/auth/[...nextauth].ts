import NextAuth from "next-auth"
import Google from "next-auth/providers/google"
require('dotenv').config();

const clientId = `${process.env.GOOGLE_CLIENT_ID}`;
const clientSecret = `${process.env.GOOGLE_CLIENT_SECRET}`
const secret = `${process.env.SECRET}`

const authOptions = { 
  providers: [
    Google({
      clientId: clientId || "",
      clientSecret: clientSecret || "",
    })
  ],
  secret: secret,
}

export default NextAuth(authOptions)
