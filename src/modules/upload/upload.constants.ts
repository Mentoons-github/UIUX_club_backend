export const FILE_TYPE_MAP = {
  images: ["image/jpeg", "image/png", "image/gif", "image/webp"],
  documents: [
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "text/plain",
    "application/rtf",
    "application/json",
  ],
  videos: ["video/mp4", "video/mpeg", "video/quicktime"],
  audio: [
    "audio/mpeg",
    "audio/wav",
    "audio/ogg",
    "audio/webm",
    "audio/flac",
    "audio/x-m4a",
    "audio/aac",
  ],
};

export const ALLOWED_TYPES = Object.values(FILE_TYPE_MAP).flat();
