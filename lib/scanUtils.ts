const ACCEPTED_TYPES = ["image/jpeg", "image/png", "image/webp"];
const MAX_FILE_BYTES = 15 * 1024 * 1024; // 15MB, generous for a phone camera photo pre-compression

export function isAcceptedImageFile(file: File): boolean {
  return ACCEPTED_TYPES.includes(file.type) && file.size <= MAX_FILE_BYTES;
}

/** Turns "indie-gig_poster_02.jpg" into "Indie Gig Poster 02" for a best-guess title suggestion. */
export function titleFromFilename(filename: string): string {
  const withoutExtension = filename.replace(/\.[^./\\]+$/, "");
  const words = withoutExtension
    .replace(/[-_]+/g, " ")
    .trim()
    .split(/\s+/)
    .filter(Boolean);
  if (words.length === 0) return "Untitled Event";
  return words.map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
}

/** Finds the first http(s) URL in a string, used for crude "QR/URL detection" on manually pasted text. */
export function findFirstUrl(text: string): string | null {
  const match = text.match(/https?:\/\/[^\s]+/i);
  return match ? match[0] : null;
}

/** Only allow http/https links to be rendered as clickable external actions (NFR-04). */
export function isSafeExternalUrl(url: string | undefined | null): url is string {
  if (!url) return false;
  try {
    const parsed = new URL(url);
    return parsed.protocol === "http:" || parsed.protocol === "https:";
  } catch {
    return false;
  }
}

/**
 * Resizes an image file to a max width and re-encodes as JPEG to keep poster photos small
 * enough to persist in localStorage (NFR-02). Resolves to a data URL.
 */
export function compressImageFile(file: File, maxWidth = 900, quality = 0.72): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error("Could not read file"));
    reader.onload = () => {
      const img = new Image();
      img.onerror = () => reject(new Error("Could not decode image"));
      img.onload = () => {
        const scale = Math.min(1, maxWidth / img.width);
        const canvas = document.createElement("canvas");
        canvas.width = Math.round(img.width * scale);
        canvas.height = Math.round(img.height * scale);
        const ctx = canvas.getContext("2d");
        if (!ctx) {
          reject(new Error("Canvas not supported"));
          return;
        }
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL("image/jpeg", quality));
      };
      img.src = reader.result as string;
    };
    reader.readAsDataURL(file);
  });
}
