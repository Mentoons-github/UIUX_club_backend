import express from "express";
import { createPost, getUserFeed } from "./post.controller";
import { upload } from "../upload/upload.middleware";
import { verifyAuth } from "../../middleware/auth.midleware";
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
route.use(verifyAuth);

route.post("/", upload.array("media", 10), createPost);
route.get("/feed", getUserFeed);

//Likes
route.post("/:postId/like", likePost);
route.delete("/:postId/dislike", dislikePost);

//comment
route
  .route("/:postId/comments")
  .get(getPostComments)
  .post(validate(addCommentSchema), addComment);

route.post(
  "/comments/:commentId/reply",
  validate(replyCommentSchema),
  addReply,
);

route.get("/comments/:commentId/replies", getMoreReplies);

export default route;
