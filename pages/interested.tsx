import { useEffect, useState } from "react";
import { Heart } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { ListingCard } from "@/components/ListingCard";
import { useInterestStore } from "@/lib/store/useInterestStore";
import { useScannedStore } from "@/lib/store/useScannedStore";
import { useToastStore } from "@/lib/store/useToastStore";
import { getAllListings } from "@/lib/services/listings";
import type { Listing } from "@/lib/types";

export default function InterestedPage() {
  const [apiListings, setApiListings] = useState<Listing[] | null>(null);
  const scannedItems = useScannedStore((s) => s.items);
  const savedIds = useInterestStore((s) => s.savedIds);
  const remove = useInterestStore((s) => s.remove);
  const showToast = useToastStore((s) => s.show);

  useEffect(() => {
    getAllListings().then(setApiListings);
  }, []);

  const allListings: Listing[] = [...(apiListings ?? []), ...scannedItems];
  const saved = allListings.filter((l) => savedIds.includes(l.id));

  return (
    <AppShell>
      <h1 className="mb-1 text-xl font-bold text-foreground">Interested</h1>
      <p className="mb-6 text-sm text-muted">
        Everything you&apos;ve liked in Discover or saved from a scanned poster, in one list.
      </p>

      {apiListings === null ? (
        <p className="text-sm text-muted">Loading...</p>
      ) : saved.length === 0 ? (
        <div className="flex h-[40vh] flex-col items-center justify-center gap-3 text-center text-muted">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-sand text-accent">
            <Heart aria-hidden />
          </div>
          <p className="font-medium text-foreground">Nothing saved yet</p>
          <p className="text-sm">Swipe right in Discover, or scan a poster, to save it here.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {saved.map((listing) => (
            <ListingCard
              key={listing.id}
              listing={listing}
              showSource
              removeLabel={`Remove ${listing.name} from Interested`}
              onRemove={() => {
                remove(listing.id);
                showToast(`Removed "${listing.name}" from Interested`);
              }}
            />
          ))}
        </div>
      )}
    </AppShell>
  );
}
