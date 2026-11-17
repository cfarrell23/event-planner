import type { AppProps } from "next/app";
import { Inter, Bitter, Caveat } from "next/font/google";
import { SessionProvider } from "next-auth/react";
import { Toaster } from "@/components/ui/Toaster";
import "@/styles/globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });
const bitter = Bitter({ subsets: ["latin"], weight: ["600", "700", "800"], variable: "--font-display" });
const caveat = Caveat({ subsets: ["latin"], weight: ["600"], variable: "--font-script" });

export default function App({ Component, pageProps: { session, ...pageProps } }: AppProps) {
  return (
    <SessionProvider session={session}>
      <div className={`${inter.variable} ${bitter.variable} ${caveat.variable} font-sans`}>
        <Component {...pageProps} />
        <Toaster />
      </div>
    </SessionProvider>
  );
}
