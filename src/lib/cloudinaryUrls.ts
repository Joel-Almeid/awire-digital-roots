// Helpers to build Cloudinary URLs safely for view/download behaviors.
// Rules:
// - View: always use the original URL (no transformations).
// - Download: images should force download via fl_attachment.
//            PDFs must remain as the original URL (no fl_attachment) to avoid 401/404 issues.

const isCloudinaryUrl = (url: string) => /https?:\/\/res\.cloudinary\.com\//i.test(url);

const getLowerPath = (url: string) => {
  try {
    return new URL(url).pathname.toLowerCase();
  } catch {
    return url.toLowerCase();
  }
};

export const isPdfUrl = (url: string) => getLowerPath(url).includes(".pdf");

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
  // "Ver" must never apply transformations.
  return url;
};

export const getCloudinaryDownloadUrl = (url: string) => {
  if (!url) return url;
  // PDFs: keep the original URL exactly as stored (no /raw, no fl_attachment).
  return isPdfUrl(url) ? url : ensureImageAttachment(url);
};
