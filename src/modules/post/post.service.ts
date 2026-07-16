import AppError from "../../utils/AppError";
import { uploadFiles } from "../media/media.service";
import PostModel from "./post.model";
import { CreatePostInput } from "./post.types";
import LikeModel from "./likes/like.model";
import { attachIsLiked, hasUserLikedPost } from "./likes";
import { increasePostCount } from "../user";
import mongoose from "mongoose";

//Owner Posts
export const getUserPosts = async (userId: string, currentUser?: string) => {
  const posts = await PostModel.find({ author: userId });
  if (!posts.length) {
    throw new AppError("No posts found", 404);
  }

  const userLikedPosts = await attachIsLiked(posts as any, currentUser);

  return userLikedPosts;
};


export const uploadPost = async (postData: CreatePostInput, userId: string) => {
  const session = await mongoose.startSession();

  try {
    session.startTransaction();
    console.log("session starts");

    const files = postData.media as Express.Multer.File[];

    const media = await uploadFiles(files, userId);

    const [post] = await PostModel.create(
      [
        {
          author: userId,
          caption: postData.caption?.trim() || "",
          media,
          tags: postData.tags?.length ? postData.tags : [],
        },
      ],
      { session },
    );

    await increasePostCount(userId, session);

    await session.commitTransaction();

    return post;
  } catch (error) {
    console.log(error);
    await session.abortTransaction();

    if (error instanceof AppError) {
      throw error;
    }

    throw new AppError("Failed to upload post", 500);
  } finally {
    session.endSession();
  }
};

//userFeed
export const getUserFeedPosts = async (userId?: string) => {
  console.log("userId : ", userId);
  const posts = await PostModel.find({ visibility: "public" })
    .populate("author", "firstName lastName profilePicture")
    .sort({ createdAt: -1 });

  let likedPostIds = new Set<string>();

  if (userId) {
    const likes = await LikeModel.find({ user: userId });
    likedPostIds = new Set(likes.map((l) => l.post.toString()));
  }

  const enrichedPosts = posts.map((post: any) => ({
    ...post.toObject(),
    isLiked: userId ? likedPostIds.has(post._id.toString()) : false,
  }));

  console.log("enrichedPosts :", enrichedPosts);

  return enrichedPosts;
};

export const getPostById = async (postId: string, userId?: string) => {
  if (!postId) {
    throw new AppError("No post found", 404);
  }

  const post = await PostModel.findById(postId).populate({
    path: "author",
    select: "firstName lastName profilePicture",
  });

  if (!post) {
    throw new AppError("No post found", 404);
  }

  const isLiked = userId
    ? !!(await hasUserLikedPost({ postId, userId }))
    : false;

  return {
    ...post.toObject(),
    isLiked,
  };
};

//check
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

// export const addShareCount = async (postId: string) => {
//   if (!mongoose.Types.ObjectId.isValid(postId)) {
//     throw new AppError("PostId not found", 404);
//   }
//   const update = await PostModel.findByIdAndUpdate(
//     postId,
//     {
//       $inc: { shareCount: 1 },
//     },
//     { new: true },
//   );

//   if (!update) {
//     throw new AppError("Post not found", 404);
//   }

//   return update;
// };
