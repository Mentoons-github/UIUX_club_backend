import AppError from "../../../utils/AppError";
import PostModel from "../post.model";
import LikeModel from "./like.model";

export const likePostService = async ({
  userId,
  postId,
}: {
  userId: string;
  postId: string;
}) => {
  try {
    const existing = await LikeModel.findOne({
      user: userId,
      post: postId,
    });

    if (existing) {
      throw new AppError("Post already liked", 400);
    }
    const like = await LikeModel.create({ user: userId, post: postId });
    await PostModel.findByIdAndUpdate(postId, { $inc: { likeCount: 1 } });

    return like;
  } catch (err) {
    console.error(err);
    throw new AppError("Failed to like post", 500);
  }
};

export const dislikePostService = async ({
  userId,
  postId,
}: {
  userId: string;
  postId: string;
}) => {
  try {
    const result = await LikeModel.deleteOne({
      user: userId,
      post: postId,
    });
    if (result.deletedCount === 0) {
      throw new AppError("No like found to dislike", 404);
    }

    await PostModel.findByIdAndUpdate(postId, { $inc: { likeCount: -1 } });

    return result;
  } catch (err) {
    console.error(err);
    throw new AppError("Failed to dislike post", 500);
  }
};
