import AppError from "../../../utils/AppError";
import DesignShowcaseModel from "../designShowcase.model";
import DesignLikeModel from "./designLike.model";

export const incrementDesignLikesCount = async (designId: string) => {
  const design = await DesignShowcaseModel.findByIdAndUpdate(
    designId,
    { $inc: { likesCount: 1 } },
    { new: true },
  );

  if (!design) {
    throw new AppError("Design not found", 404);
  }

  return design;
};

export const decrementDesignLikesCount = async (designId: string) => {
  const design = await DesignShowcaseModel.findByIdAndUpdate(
    designId,
    { $inc: { likesCount: -1 } },
    { new: true },
  );

  if (!design) {
    throw new AppError("Design not found", 404);
  }

  return design;
};

export const likeDesign = async (userId: string, designId: string) => {
  if (!designId) {
    throw new AppError("No DesignId found", 404);
  }

  const isLikeExist = await hasUserLikedDesign({ designId, userId });

  if (isLikeExist) {
    throw new AppError("Already liked", 409);
  }

  const like = await DesignLikeModel.create({
    user: userId,
    design: designId,
  });

  await incrementDesignLikesCount(designId);

  return like;
};

export const dislikeDesign = async (userId: string, designId: string) => {
  const deleted = await DesignLikeModel.findOneAndDelete({
    user: userId,
    design: designId,
  });

  if (!deleted) {
    throw new AppError("Like not found", 404);
  }

  await decrementDesignLikesCount(designId);

  return deleted;
};

export const hasUserLikedDesign = async ({
  designId,
  userId,
}: {
  designId: string;
  userId: string;
}) => {
  const isLiked = await DesignLikeModel.exists({
    design: designId,
    user: userId,
  });

  return isLiked;
};

export const getTotalDesignLikes = async () => {
  return await DesignLikeModel.countDocuments();
};
