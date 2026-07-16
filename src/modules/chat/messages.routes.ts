import { Router } from "express";
import {
  findOrCreateConversation,
  getConversations,
  getMessages,
} from "./message.controller";
import { verifyAuth } from "../../middleware/auth.middleware";
import { ensureUserExists } from "../../middleware/ensureUserExists.middleware";
import { validate } from "../../middleware/validate.middleware";
import { findOrCreateConversationSchema } from "./conversation.validation";

const router = Router();

router.get("/conversations", verifyAuth, ensureUserExists, getConversations);
router.get(
  "/conversations/:conversationId/messages",
  verifyAuth,
  ensureUserExists,
  getMessages,
);

router.post(
  "/conversations/find-or-create",
  verifyAuth,
  ensureUserExists,
  validate(findOrCreateConversationSchema),
  findOrCreateConversation,
);

export default router;
