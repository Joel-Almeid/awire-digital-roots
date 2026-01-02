// Helpers to build Cloudinary URLs safely for view/download behaviors.
// Rules:
// - View PDFs: use Google Docs Viewer to ensure compatibility.
// - View Images: use original URL.
// - Download Images: force download via fl_attachment.
// - Download PDFs: keep original URL (no fl_attachment to avoid 401/404).

const isCloudinaryUrl = (url: string) => /https?:\/\/res\.cloudinary\.com\//i.test(url);

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

// Google Docs Viewer for universal PDF rendering
export const getGoogleViewerUrl = (url: string) => {
  if (!url) return url;
  const encodedUrl = encodeURIComponent(url);
  return `https://docs.google.com/gview?embedded=true&url=${encodedUrl}`;
};

const ensureImageAttachment = (url: string) => {
  if (!isCloudinaryUrl(url)) return url;
  if (url.includes("/fl_attachment/")) return url;

  if (url.includes("/image/upload/")) {
    return url.replace("/image/upload/", "/image/upload/fl_attachment/");
  }

  if (url.includes("/auto/upload/")) {
    // If upload used /auto/upload, keep download behavior as image attachment.
    return url.replace("/auto/upload/", "/image/upload/fl_attachment/");
  }

  return url;
};

export const getCloudinaryViewUrl = (url: string) => {
  if (!url) return url;
  // PDFs: use Google Docs Viewer for universal compatibility.
  // Images: use original URL directly.
  return isPdfUrl(url) ? getGoogleViewerUrl(url) : url;
};

export const getCloudinaryDownloadUrl = (url: string) => {
  if (!url) return url;
  // PDFs: keep the original URL exactly as stored (no /raw, no fl_attachment).
  return isPdfUrl(url) ? url : ensureImageAttachment(url);
};
