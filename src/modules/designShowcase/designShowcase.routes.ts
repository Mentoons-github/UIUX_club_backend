import express from "express";
import {
  addDesign,
  designShowcaseStats,
  getAllDesigns,
  getDesignDetails,
  getUserDesignsPaginated,
} from "./designShowcase.controller";
import {
  addDesignDisLike,
  addDesignLike,
} from "./designLike/designLike.controller";
import { validate } from "../../middleware/validate.middleware";
import { createDesignShowcaseSchema } from "./designShowcase.validation";
import { optionalAuth, verifyAuth } from "../../middleware/auth.middleware";
import { upload } from "../media/media.middleware";
import {
  addDesignComment,
  addDesignReply,
  getDesignComments,
  getMoreDesignReplies,
} from "./designComment/designComment.controller";

const router = express.Router();

router
  .route("/")
  .post(
    verifyAuth,
    upload.fields([
      { name: "thumbnail", maxCount: 1 },
      { name: "images", maxCount: 8 },
    ]),
    validate(createDesignShowcaseSchema),
    addDesign,
  )
  .get(optionalAuth, getAllDesigns);

router.get("/stats", designShowcaseStats);

router.get("/:userId/designs", getUserDesignsPaginated);

router.get("/:designId", optionalAuth, getDesignDetails);

// Likes
router.post("/:designId/like", verifyAuth, addDesignLike);
router.post("/:designId/dislike", verifyAuth, addDesignDisLike);

// Feedback (comments)
router
  .route("/comments/:designId")
  .post(verifyAuth, addDesignComment)
  .get(optionalAuth, getDesignComments);

router.post("/comments/:designId/reply", verifyAuth, addDesignReply);

router.get("/comments/:commentId/replies", optionalAuth, getMoreDesignReplies);

export default router;
