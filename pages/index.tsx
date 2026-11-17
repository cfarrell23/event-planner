import { useEffect } from "react";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import { useProfileStore } from "@/lib/store/useProfileStore";

/** Entry point: routes the visitor to sign-in, onboarding, or the main app. */
export default function Home() {
  const router = useRouter();
  const { status } = useSession();
  const onboarded = useProfileStore((s) => s.onboarded);

  useEffect(() => {
    if (status === "loading") return;
    if (status === "unauthenticated") {
      router.replace("/signin");
    } else if (!onboarded) {
      router.replace("/onboarding");
    } else {
      router.replace("/discover");
    }
  }, [status, onboarded, router]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background text-muted">
      Loading...
    </div>
  );
}
