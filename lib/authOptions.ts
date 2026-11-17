import type { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";

/**
 * Real Google OAuth requires GOOGLE_CLIENT_ID / GOOGLE_CLIENT_SECRET from a Google Cloud
 * OAuth 2.0 client (Authorized redirect URI: <deployment-url>/api/auth/callback/google).
 * See .env.local.example. Until those are set, sign-in falls back to a one-click mock
 * "google" provider (same provider id) so the app is demoable without real credentials.
 */
export const isGoogleConfigured = Boolean(
  process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET,
);

const googleProvider = isGoogleConfigured
  ? GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    })
  : CredentialsProvider({
      id: "google",
      name: "Google (mock)",
      credentials: {},
      async authorize() {
        return {
          id: "mock-user-1",
          name: "Alex Rivera",
          email: "alex.rivera@example.com",
          image: null,
        };
      },
    });

/**
 * Falls back to a hardcoded secret if NEXTAUTH_SECRET isn't set in the deployment environment,
 * so sign-in never 500s on a misconfigured env var during the hackathon demo. There's no real
 * user data at stake here — setting NEXTAUTH_SECRET properly is still the correct long-term fix.
 */
const secret = process.env.NEXTAUTH_SECRET ?? "weekahead-hackathon-demo-fallback-secret-2026";

export const authOptions: NextAuthOptions = {
  providers: [googleProvider],
  session: { strategy: "jwt" },
  secret,
  pages: {
    signIn: "/signin",
  },
};
