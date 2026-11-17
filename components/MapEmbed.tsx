/** Google Maps iframe embed — no API key required for the basic `output=embed` query form. */
export function MapEmbed({ address, name }: { address: string; name: string }) {
  const query = encodeURIComponent(`${name}, ${address}`);
  return (
    <div className="overflow-hidden rounded-2xl border border-border">
      <iframe
        title={`Map showing ${name}`}
        width="100%"
        height="220"
        style={{ border: 0 }}
        loading="lazy"
        src={`https://www.google.com/maps?q=${query}&output=embed`}
      />
    </div>
  );
}
