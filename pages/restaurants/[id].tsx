import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { AppShell } from "@/components/layout/AppShell";
import { ListingDetail } from "@/components/ListingDetail";
import { getListingById } from "@/lib/services/listings";
import type { Listing } from "@/lib/types";

export default function RestaurantDetailPage() {
  const router = useRouter();
  const { id } = router.query;
  const [listing, setListing] = useState<Listing | null | undefined>(undefined);

  useEffect(() => {
    if (typeof id !== "string") return;
    getListingById(id).then((l) => setListing(l ?? null));
  }, [id]);

  return (
    <AppShell>
      {listing === undefined && <p className="text-sm text-muted">Loading...</p>}
      {listing === null && <p className="text-sm text-muted">Restaurant not found.</p>}
      {listing && <ListingDetail listing={listing} />}
    </AppShell>
  );
}
