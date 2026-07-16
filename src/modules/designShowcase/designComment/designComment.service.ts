import AppError from "../../../utils/AppError";
import DesignShowcaseModel from "../designShowcase.model";
import DesignCommentModel from "./designComment.model";

export const incrementDesignFeedbackCount = async (designId: string) => {
  const design = await DesignShowcaseModel.findByIdAndUpdate(
    designId,
    { $inc: { feedbackCount: 1 } },
    { new: true },
  );

  if (!design) {
    throw new AppError("Design not found", 404);
  }

  return design;
};

export const decrementDesignFeedbackCount = async (designId: string) => {
  const design = await DesignShowcaseModel.findByIdAndUpdate(
    designId,
    { $inc: { feedbackCount: -1 } },
    { new: true },
  );

  if (!design) {
    throw new AppError("Design not found", 404);
  }

  return design;
};

const strictDesignExists = async (designId: string) => {
  const design = await DesignShowcaseModel.findById(designId);

  if (!design) {
    throw new AppError("Design not found", 404);
  }

  return design;
};

const strictParentCommentExists = async ({
  parentId,
  designId,
}: {
  parentId: string;
  designId: string;
}) => {
  try {
    const parent = await DesignCommentModel.findOne({
      _id: parentId,
      design: designId,
    });

    return parent;
  } catch {
    throw new AppError("Failed to fetch parent comment", 500);
  }
};

export const getDesignCommentsService = async ({
  designId,
  page = 1,
  limit = 5,
}: {
  designId: string;
  page?: number;
  limit?: number;
}) => {
  await strictDesignExists(designId);

  const skip = (page - 1) * limit;

  const mainComments = await DesignCommentModel.find({
    design: designId,
    parentComment: null,
  })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .populate("author", "firstName lastName profilePicture")
    .lean();

  const commentsWithReplies = await Promise.all(
    mainComments.map(async (comment) => {
      const replies = await DesignCommentModel.find({
        parentComment: comment._id,
      })
        .sort({ createdAt: -1 })
        .limit(3)
        .populate("author", "firstName lastName profilePicture")
        .lean();

      return {
        ...comment,
        replies,
        repliesCount: await DesignCommentModel.countDocuments({
          parentComment: comment._id,
        }),
      };
    }),
  );

  const totalMainComments = await DesignCommentModel.countDocuments({
    design: designId,
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

export const createDesignComment = async ({
  userId,
  content,
  designId,
}: {
  userId: string;
  content: string;
  designId: string;
}) => {
  await strictDesignExists(designId);

  const comment = await DesignCommentModel.create({
    author: userId,
    content,
    design: designId,
  });

  await incrementDesignFeedbackCount(designId);

  return comment;
};

export const addDesignReplyComment = async ({
  content,
  parentComment,
  designId,
  userId,
}: {
  content: string;
  parentComment: string;
  designId: string;
  userId: string;
}) => {
  await strictDesignExists(designId);

  const parent = await strictParentCommentExists({
    parentId: parentComment,
    designId,
  });

  if (!parent) {
    throw new AppError("Parent comment not found", 404);
  }

  const comment = await DesignCommentModel.create({
    author: userId,
    content,
    parentComment,
    design: designId,
  });

  await incrementDesignFeedbackCount(designId);

  return comment;
};

export const deleteDesignComment = async ({
  commentId,
  userId,
}: {
  commentId: string;
  userId: string;
}) => {
  const comment = await DesignCommentModel.findOneAndDelete({
    _id: commentId,
    author: userId,
  });

  if (!comment) {
    throw new AppError("Comment not found", 404);
  }

  await decrementDesignFeedbackCount(comment.design.toString());

  return comment;
};

export const getDesignRepliesService = async ({
  parentCommentId,
  page = 1,
  limit = 5,
}: {
  parentCommentId: string;
  page?: number;
  limit?: number;
}) => {
  const skip = (page - 1) * limit;

  const replies = await DesignCommentModel.find({
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
      repliesCount: await DesignCommentModel.countDocuments({
        parentComment: reply._id,
      }),
    })),
  );

  const total = await DesignCommentModel.countDocuments({
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
