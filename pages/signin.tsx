import { useEffect } from "react";
import { useRouter } from "next/router";
import { signIn, useSession } from "next-auth/react";
import { Sparkles } from "lucide-react";
import { Button } from "@/components/ui/Button";

export default function SignIn() {
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
        <span className="text-accent">Night</span>Planner
      </h1>
      <p className="mb-8 max-w-sm text-sm text-muted">
        Discover London&apos;s best clubs, gigs, comedy nights, pop-ups, and dinner spots — curated
        for your week, with deals built in.
      </p>
      <Button size="lg" onClick={() => signIn("google", { callbackUrl: "/" })}>
        Sign in with Google
      </Button>
    </div>
  );
}
