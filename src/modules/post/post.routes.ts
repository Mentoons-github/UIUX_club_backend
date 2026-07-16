import express from "express";
import {
  createPost,
  getPostDetail,
  getPostsByUser,
  getUserFeed,
} from "./post.controller";
import { upload } from "../media/media.middleware";
import { optionalAuth, verifyAuth } from "../../middleware/auth.middleware";
import { validate } from "../../middleware/validate.middleware";
import { dislikePost, likePost } from "./likes";
import {
  addComment,
  addCommentSchema,
  addReply,
  getMoreReplies,
  getPostComments,
  replyCommentSchema,
} from "./comments";

const route = express.Router();

route.get("/feed", optionalAuth, getUserFeed);
route.post(
  "/comments/:commentId/reply",
  verifyAuth,
  validate(replyCommentSchema),
  addReply,
);
route.get("/comments/:commentId/replies", getMoreReplies);

route.get("/user/:userId", optionalAuth, getPostsByUser);

route.get("/:postId", optionalAuth, getPostDetail);

route.use(verifyAuth);

route.post("/", upload.array("media", 10), createPost);

// Likes
route.post("/:postId/like", likePost);
route.delete("/:postId/dislike", dislikePost);

// Comments
route
  .route("/:postId/comments")
  .get(getPostComments)
  .post(validate(addCommentSchema), addComment);

export default route;
