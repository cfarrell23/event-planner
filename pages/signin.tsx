import { useEffect } from "react";
import type { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import { signIn, useSession } from "next-auth/react";
import { Sparkles } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { RetroWaves } from "@/components/layout/RetroWaves";
import { isGoogleConfigured } from "@/lib/authOptions";

interface SignInProps {
  isMock: boolean;
}

export const getServerSideProps: GetServerSideProps<SignInProps> = async () => ({
  props: { isMock: !isGoogleConfigured },
});

export default function SignIn({ isMock }: SignInProps) {
  const router = useRouter();
  const { status } = useSession();

  useEffect(() => {
    if (status === "authenticated") {
      router.replace("/");
    }
  }, [status, router]);

  return (
    <div className="relative flex min-h-screen items-center justify-center px-4">
      <RetroWaves className="fixed inset-0 z-0 h-full w-full" />
      <div className="relative z-10 flex w-full max-w-sm flex-col items-center rounded-[2rem] border border-border bg-surface px-6 py-10 text-center shadow-card">
        <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-accent/15 text-accent">
          <Sparkles size={32} aria-hidden />
        </div>
        <h1 className="mb-1 font-display text-3xl font-extrabold tracking-tight text-brand-green">
          Week<span className="text-accent">Ahead</span>
        </h1>
        <p className="mb-6 font-script text-xl text-accent">Great plan, just in time</p>
        <p className="mb-8 text-sm text-muted">
          Discover London&apos;s best clubs, gigs, comedy nights, pop-ups, and dinner spots — or scan a
          poster you spot out and about — all in one weekly plan.
        </p>
        <Button size="lg" onClick={() => signIn("google", { callbackUrl: "/" })}>
          Sign in with Google
        </Button>
        {isMock && (
          <p className="mt-3 max-w-xs text-xs text-muted">
            Demo mode: signs you in as a mock account — no real Google login configured yet.
          </p>
        )}
      </div>
    </div>
  );
}
