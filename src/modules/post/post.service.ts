import AppError from "../../utils/AppError";
import { uploadFile } from "../upload/upload.service";
import PostModel from "./post.model";
import pLimit from "p-limit";
import { CreatePostInput } from "./post.types";
import LikeModel from "./likes/like.model";

//Owner Posts
export const getUserPosts = async (userId: string) => {
  const posts = await PostModel.find({ author: userId });
  if (!posts) {
    throw new AppError("No posts found", 404);
  }

  return posts;
};

//Upload Posts
export const uploadPost = async (postData: CreatePostInput, userId: string) => {
  let media: any[] = [];

  const files = postData.media as Express.Multer.File[];

  if (files && files.length > 0) {
    const limit = pLimit(3);

    const uploadedFiles = await Promise.all(
      files.map((file) => limit(() => uploadFile(file, userId))),
    );

    media = uploadedFiles.map((file) => ({
      url: file.url,
      type: file.mimetype.startsWith("video") ? "video" : "image",
    }));
  }

  const tags = postData?.tags?.length ? postData.tags : [];

  const post = await PostModel.create({
    author: userId,
    caption: postData.caption?.trim() || "",
    media,
    tags,
  });

  return post;
};

//userFeed
export const getUserFeedPosts = async (userId: string) => {
  const posts = await PostModel.find({ visibility: "public" })
    .populate("author", "firstName lastName profilePicture")
    .sort({ createdAt: -1 });

  const likes = await LikeModel.find({ user: userId });

  const likedPostIds = new Set(likes.map((l) => l.post.toString()));

  const enrichedPosts = posts.map((post: any) => ({
    ...post.toObject(),
    isLiked: likedPostIds.has(post._id.toString()),
  }));

  return enrichedPosts;
};

export const strictPostExists = async (postId: string) => {
  try {
    const result = await PostModel.findById(postId);
    if (!result) {
      throw new AppError("No post found", 404);
    }
    return result;
  } catch (err) {
    throw new AppError("Error fetching post", 500);
  }
};
