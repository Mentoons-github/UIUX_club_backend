import multer from "multer";
import path from "path";
import { ALLOWED_TYPES } from "./media.constants";

export const upload = multer({
  storage: multer.memoryStorage(),

  limits: {
    fileSize: 200 * 1024 * 1024, // 200MB max file size
    files: 10, // Limit to single file upload
  },

  fileFilter: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const mimetype = file.mimetype;

    if (ALLOWED_TYPES.includes(mimetype)) {
      cb(null, true);
    } else {
      const error = new Error("Invalid file type") as Error & {
        details?: object;
      };
      console.log(error);
      error.details = {
        originalname: file.originalname,
        mimetype: mimetype,
        allowedTypes: ALLOWED_TYPES,
      };
      cb(error);
    }
  },
});
