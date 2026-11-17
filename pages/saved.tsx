import { useEffect, useState } from "react";
import { Heart } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { ListingCard } from "@/components/ListingCard";
import { useInterestStore } from "@/lib/store/useInterestStore";
import { useToastStore } from "@/lib/store/useToastStore";
import { getAllListings } from "@/lib/services/listings";
import type { Listing } from "@/lib/types";

export default function SavedPage() {
  const [listings, setListings] = useState<Listing[] | null>(null);
  const savedIds = useInterestStore((s) => s.savedIds);
  const remove = useInterestStore((s) => s.remove);
  const showToast = useToastStore((s) => s.show);

  useEffect(() => {
    getAllListings().then(setListings);
  }, []);

  const saved = (listings ?? []).filter((l) => savedIds.includes(l.id));

  return (
    <AppShell>
      <h1 className="mb-6 text-xl font-bold text-foreground">Saved / Interested</h1>

      {listings === null ? (
        <p className="text-sm text-muted">Loading...</p>
      ) : saved.length === 0 ? (
        <div className="flex h-[40vh] flex-col items-center justify-center gap-2 text-center text-muted">
          <Heart aria-hidden />
          <p className="font-medium text-foreground">Nothing saved yet</p>
          <p className="text-sm">Swipe right on something in For You to save it here.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {saved.map((listing) => (
            <ListingCard
              key={listing.id}
              listing={listing}
              removeLabel={`Remove ${listing.name} from Saved`}
              onRemove={() => {
                remove(listing.id);
                showToast(`Removed "${listing.name}" from Saved`);
              }}
            />
          ))}
        </div>
      )}
    </AppShell>
  );
}
