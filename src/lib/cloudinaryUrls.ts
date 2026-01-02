// Helpers for file URLs.
// IMPORTANT RULE (per latest decision):
// - NEVER transform the stored URL for view/download.
// - Always use the raw URL coming from the database (e.g., url/secure_url).

const getLowerPath = (url: string) => {
  try {
    return new URL(url).pathname.toLowerCase();
  } catch {
    return url.toLowerCase();
  }
};

export const isPdfUrl = (url: string) => getLowerPath(url).includes(".pdf");

export const isImageUrl = (url: string) => {
  const path = getLowerPath(url);
  return /\.(jpg|jpeg|png|gif|webp|bmp|svg)$/i.test(path);
};

// Kept for compatibility with existing imports (if any), but intentionally NO-OP.
export const getCloudinaryViewUrl = (url: string) => url;

// Kept for compatibility with existing imports (if any), but intentionally NO-OP.
export const getCloudinaryDownloadUrl = (url: string) => url;
