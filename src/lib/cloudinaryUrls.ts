// Helpers to build Cloudinary URLs safely for view/download behaviors.
// Rules:
// - View: never use fl_attachment. PDFs should use /raw/upload/ to avoid 401.
// - Download: images should force download via fl_attachment. PDFs should use /raw/upload/ (no attachment) and rely on browser download.

const isCloudinaryUrl = (url: string) => /https?:\/\/res\.cloudinary\.com\//i.test(url);

const getLowerPath = (url: string) => {
  try {
    return new URL(url).pathname.toLowerCase();
  } catch {
    return url.toLowerCase();
  }
};

export const isPdfUrl = (url: string) => getLowerPath(url).includes(".pdf");

const ensureRawUpload = (url: string) => {
  if (!isCloudinaryUrl(url)) return url;

  return url
    .replace("/image/upload/", "/raw/upload/")
    .replace("/auto/upload/", "/raw/upload/");
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
  return isPdfUrl(url) ? ensureRawUpload(url) : url;
};

export const getCloudinaryDownloadUrl = (url: string) => {
  if (!url) return url;
  return isPdfUrl(url) ? ensureRawUpload(url) : ensureImageAttachment(url);
};
