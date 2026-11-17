import { useRouter } from "next/router";
import { AppShell } from "@/components/layout/AppShell";
import { ListingDetail } from "@/components/ListingDetail";
import { useScannedStore } from "@/lib/store/useScannedStore";

export default function ScannedDetailPage() {
  const router = useRouter();
  const { id } = router.query;
  const listing = useScannedStore((s) => (typeof id === "string" ? s.getById(id) : undefined));

  return (
    <AppShell>
      {!id || typeof id !== "string" ? (
        <p className="text-sm text-muted">Loading...</p>
      ) : !listing ? (
        <p className="text-sm text-muted">Scanned item not found.</p>
      ) : (
        <ListingDetail listing={listing} />
      )}
    </AppShell>
  );
}
