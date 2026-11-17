import { useRef, useState } from "react";
import { useRouter } from "next/router";
import Image from "next/image";
import { Camera, Upload, AlertCircle, Loader2 } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { Button } from "@/components/ui/Button";
import { ScanReviewForm, type ScanReviewValues } from "@/components/ScanReviewForm";
import { useScannedStore } from "@/lib/store/useScannedStore";
import { useInterestStore } from "@/lib/store/useInterestStore";
import { useToastStore } from "@/lib/store/useToastStore";
import { compressImageFile, isAcceptedImageFile, titleFromFilename } from "@/lib/scanUtils";
import { recognizePosterText, parsePosterText } from "@/lib/posterOcr";
import { toIsoDate } from "@/lib/utils";
import type { FieldConfidence, ScannedItem } from "@/lib/types";

const LONDON_LAT = 51.5072;
const LONDON_LNG = -0.1276;

type Stage = "capture" | "extracting" | "review" | "error";

export default function ScanPosterPage() {
  const router = useRouter();
  const [stage, setStage] = useState<Stage>("capture");
  const [imageDataUrl, setImageDataUrl] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [initialValues, setInitialValues] = useState<ScanReviewValues | null>(null);
  const [fieldConfidence, setFieldConfidence] = useState<Record<
    "name" | "date" | "time" | "venue" | "priceLabel",
    FieldConfidence
  > | null>(null);

  const cameraInputRef = useRef<HTMLInputElement>(null);
  const uploadInputRef = useRef<HTMLInputElement>(null);

  const addScannedItem = useScannedStore((s) => s.addItem);
  const save = useInterestStore((s) => s.save);
  const showToast = useToastStore((s) => s.show);

  async function handleFile(file: File | undefined) {
    if (!file) return;
    if (!isAcceptedImageFile(file)) {
      setErrorMessage("Please choose a JPEG, PNG, or WebP image under 15MB.");
      setStage("error");
      return;
    }

    setStage("extracting");
    try {
      const dataUrl = await compressImageFile(file);
      setImageDataUrl(dataUrl);

      // Real OCR via tesseract.js (client-side, no API key) — see lib/posterOcr.ts for the
      // text-parsing heuristics. OCR runs against the original file for best accuracy; any
      // field it can't confidently find falls back to a placeholder flagged "needs-review".
      let parsed: ReturnType<typeof parsePosterText> = {
        name: null,
        date: null,
        time: null,
        venue: null,
        priceRange: null,
        priceLabel: null,
        bookingUrl: null,
      };
      try {
        const text = await recognizePosterText(file);
        parsed = parsePosterText(text);
      } catch {
        // OCR engine failed to load/run — fall through to filename-based fallback below
        // rather than blocking the whole flow (PRD §4.3: allow manual entry on failure).
      }

      setInitialValues({
        name: parsed.name ?? titleFromFilename(file.name),
        date: parsed.date ?? toIsoDate(new Date()),
        time: parsed.time ?? "20:00",
        venue: parsed.venue ?? "",
        address: "",
        eventType: "pop-up",
        priceRange: parsed.priceRange,
        priceLabel: parsed.priceLabel ?? "",
        bookingUrl: parsed.bookingUrl ?? "",
      });
      setFieldConfidence({
        name: parsed.name ? "confident" : "needs-review",
        date: parsed.date ? "confident" : "needs-review",
        time: parsed.time ? "confident" : "needs-review",
        venue: parsed.venue ? "confident" : "needs-review",
        priceLabel: parsed.priceLabel ? "confident" : "needs-review",
      });
      setStage("review");
    } catch {
      setErrorMessage("Couldn't read that image. Try a different photo or file.");
      setStage("error");
    }
  }

  function handleSave(values: ScanReviewValues) {
    if (!imageDataUrl) return;
    const id = `scan-${crypto.randomUUID()}`;
    const item: ScannedItem = {
      id,
      kind: "scanned",
      name: values.name,
      eventType: values.eventType,
      description: "Saved from a scanned poster.",
      date: values.date,
      time: values.time,
      priceRange: values.priceRange,
      priceLabel: values.priceLabel,
      venue: values.venue || "Venue not specified",
      address: values.address || "London",
      lat: LONDON_LAT,
      lng: LONDON_LNG,
      imageUrl: imageDataUrl,
      source: "Poster Scan",
      bookingUrl: values.bookingUrl,
      fieldConfidence: fieldConfidence ?? {
        name: "confident",
        date: "needs-review",
        time: "needs-review",
        venue: "needs-review",
        priceLabel: "needs-review",
      },
      createdAt: new Date().toISOString(),
    };

    addScannedItem(item);
    save(id);
    showToast(`Saved "${item.name}" to Interested`);
    router.push("/interested");
  }

  function reset() {
    setStage("capture");
    setImageDataUrl(null);
    setInitialValues(null);
    setFieldConfidence(null);
    setErrorMessage("");
  }

  return (
    <AppShell>
      <h1 className="mb-1 text-xl font-bold text-foreground">Scan Poster</h1>
      <p className="mb-6 text-sm text-muted">
        Spotted something out and about? Photograph or upload a poster and we&apos;ll pull out the
        details for you to confirm.
      </p>

      {stage === "capture" && (
        <div className="flex flex-col items-center justify-center gap-4 rounded-2xl border border-dashed border-border bg-surface p-10 text-center">
          <Camera size={32} className="text-accent" aria-hidden />
          <p className="text-sm text-muted">Take a photo of a poster, or upload an image from your device.</p>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Button size="lg" onClick={() => cameraInputRef.current?.click()}>
              <Camera aria-hidden /> Take Photo
            </Button>
            <Button variant="secondary" size="lg" onClick={() => uploadInputRef.current?.click()}>
              <Upload aria-hidden /> Upload Image
            </Button>
          </div>
          <input
            ref={cameraInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            capture="environment"
            className="hidden"
            onChange={(e) => handleFile(e.target.files?.[0])}
          />
          <input
            ref={uploadInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            className="hidden"
            onChange={(e) => handleFile(e.target.files?.[0])}
          />
        </div>
      )}

      {stage === "extracting" && (
        <div className="flex flex-col items-center justify-center gap-4 rounded-2xl border border-border bg-surface p-10 text-center">
          {imageDataUrl && (
            <div className="relative h-40 w-40 overflow-hidden rounded-xl">
              <Image src={imageDataUrl} alt="" fill unoptimized className="object-cover" />
            </div>
          )}
          <p className="flex items-center gap-2 text-sm text-muted">
            <Loader2 className="animate-spin" size={16} aria-hidden /> Extracting details from your poster...
          </p>
        </div>
      )}

      {stage === "error" && (
        <div className="flex flex-col items-center justify-center gap-4 rounded-2xl border border-danger/30 bg-danger/10 p-10 text-center">
          <AlertCircle className="text-danger" aria-hidden />
          <p className="text-sm text-foreground">{errorMessage}</p>
          <Button variant="secondary" onClick={reset}>
            Try again
          </Button>
        </div>
      )}

      {stage === "review" && initialValues && fieldConfidence && (
        <div>
          {imageDataUrl && (
            <div className="relative mb-5 h-48 w-full overflow-hidden rounded-2xl">
              <Image src={imageDataUrl} alt="" fill unoptimized className="object-cover" />
            </div>
          )}
          <p className="mb-4 text-sm text-muted">
            Here&apos;s what we could tell from your poster — check and correct anything that needs it
            before saving.
          </p>
          <ScanReviewForm
            initialValues={initialValues}
            fieldConfidence={fieldConfidence}
            onSave={handleSave}
            onCancel={reset}
          />
        </div>
      )}
    </AppShell>
  );
}
