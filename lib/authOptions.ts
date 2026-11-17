import type { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";

/**
 * Requires GOOGLE_CLIENT_ID / GOOGLE_CLIENT_SECRET from a Google Cloud OAuth 2.0 client
 * (Authorized redirect URI: <deployment-url>/api/auth/callback/google).
 * See .env.local.example.
 */
export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID ?? "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
    }),
  ],
  session: { strategy: "jwt" },
  pages: {
    signIn: "/signin",
  },
};
