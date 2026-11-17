import Image from "next/image";
import Link from "next/link";
import { listingHref } from "@/lib/listingHelpers";
import { formatDisplayDate } from "@/lib/utils";
import type { Listing } from "@/lib/types";

/** Full-width image banner used by the Home page's "Try Something Different" section. */
export function FeatureBanner({ listing, tag }: { listing: Listing; tag: string }) {
  return (
    <Link href={listingHref(listing)} className="block">
      <div className="relative h-40 w-full overflow-hidden rounded-3xl">
        <Image src={listing.imageUrl} alt="" fill sizes="640px" className="object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />
        <div className="absolute inset-0 flex flex-col justify-end p-4">
          <span className="mb-1 w-fit rounded-full bg-white/20 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-white">
            {tag}
          </span>
          <p className="font-display text-lg font-bold text-white">{listing.name}</p>
          <p className="text-sm text-white/80">
            {listing.venue} · {formatDisplayDate(listing.date)} · {listing.priceLabel}
          </p>
        </div>
      </div>
    </Link>
  );
}
