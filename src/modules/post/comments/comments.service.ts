import AppError from "../../../utils/AppError";
import PostModel from "../post.model";
import { strictPostExists } from "../post.service";
import CommentModel from "./comments.model";

export const getPostCommentService = async ({
  postId,
  page = 1,
  limit = 5,
}: {
  postId: string;
  page?: number;
  limit?: number;
}) => {
  await strictPostExists(postId);

  const skip = (page - 1) * limit;

  const mainComments = await CommentModel.find({
    post: postId,
    parentComment: null,
  })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .populate("author", "firstName lastName profilePicture")
    .lean();

  const commentsWithReplies = await Promise.all(
    mainComments.map(async (comment) => {
      const replies = await CommentModel.find({
        parentComment: comment._id,
      })
        .sort({ createdAt: -1 })
        .limit(3)
        .populate("author", "firstName lastName profilePicture")
        .lean();

      return {
        ...comment,
        replies,
        repliesCount: await CommentModel.countDocuments({
          parentComment: comment._id,
        }),
      };
    }),
  );

  const totalMainComments = await CommentModel.countDocuments({
    post: postId,
    parentComment: null,
  });

  return {
    comments: commentsWithReplies,
    pagination: {
      currentPage: page,
      totalPages: Math.ceil(totalMainComments / limit),
      hasMore: skip + limit < totalMainComments,
      totalComments: totalMainComments,
    },
  };
};

export const crateNewComment = async ({
  userId,
  content,
  postId,
}: {
  userId: string;
  content: string;
  postId: string;
}) => {
  await strictPostExists(postId);

  const comment = await CommentModel.create({
    author: userId,
    content,
    post: postId,
  });

  await PostModel.findByIdAndUpdate(postId, { $inc: { commentCount: 1 } });

  return comment;
};

export const addReplyComment = async ({
  content,
  parentComment,
  postId,
  userId,
}: {
  content: string;
  parentComment: string;
  postId: string;
  userId: string;
}) => {
  await strictPostExists(postId);

  const parent = await strictParentCommentExists({
    parentId: parentComment,
    postId,
  });
  if (!parent) {
    throw new AppError("Parent comment not found", 404);
  }

  const comment = await CommentModel.create({
    author: userId,
    content,
    parentComment,
    post: postId,
  });

  return comment;
};

export const strictParentCommentExists = async ({
  parentId,
  postId,
}: {
  parentId: string;
  postId: string;
}) => {
  try {
    const parent = await CommentModel.findOne({
      _id: parentId,
      post: postId,
    });

    return parent;
  } catch (error) {
    throw new AppError("Failed to fetch Parent comment", 500);
  }
};

export const getRepliesService = async ({
  parentCommentId,
  page = 1,
  limit = 5,
}: {
  parentCommentId: string;
  page?: number;
  limit?: number;
}) => {
  const skip = (page - 1) * limit;

  const replies = await CommentModel.find({
    parentComment: parentCommentId,
  })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .populate("author", "firstName lastName profilePicture")
    .lean();

  const repliesWithCount = await Promise.all(
    replies.map(async (reply) => ({
      ...reply,
      replies: [],
      repliesCount: await CommentModel.countDocuments({
        parentComment: reply._id,
      }),
    })),
  );

  console.log("replies : ", repliesWithCount);

  const total = await CommentModel.countDocuments({
    parentComment: parentCommentId,
  });

  return {
    replies: repliesWithCount,
    pagination: {
      currentPage: page,
      hasMore: skip + limit < total,
      totalReplies: total,
    },
  };
};
