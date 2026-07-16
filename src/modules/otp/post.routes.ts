import express from "express";
import { getPostsByUser, uploadPost } from "../post/post.controller";

const router = express.Router();

router.route("/").post(uploadPost).get(getPostsByUser);
