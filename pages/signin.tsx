import { useEffect } from "react";
import type { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import { signIn, useSession } from "next-auth/react";
import { Sparkles } from "lucide-react";
import { Button } from "@/components/ui/Button";
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
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4 text-center">
      <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-accent/15 text-accent">
        <Sparkles size={32} aria-hidden />
      </div>
      <h1 className="mb-2 text-3xl font-bold tracking-tight text-foreground">
        Week<span className="text-accent">Ahead</span>
      </h1>
      <p className="mb-8 max-w-sm text-sm text-muted">
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
  );
}
