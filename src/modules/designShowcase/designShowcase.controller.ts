import asyncHandler from "express-async-handler";
import { uploadFile, uploadFiles } from "../media";
import {
  createDesignShowcase,
  findUserDesignsPaginated,
  getDesignById,
  getDesignShowcases,
  getDesignShowcaseStats,
} from "./designShowcase.service";
import { getPagination, successResponse } from "../../utils";
import { hasUserLikedDesign } from "./designLike";

export const addDesign = asyncHandler(async (req, res) => {
  const userId = req.user!.id;

  const files = req.files as {
    thumbnail?: Express.Multer.File[];
    images?: Express.Multer.File[];
  };

  const imageFiles = files.images ?? [];
  const thumbnailFile = files.thumbnail?.[0];

  const uploadedImages = await uploadFiles(imageFiles, userId);

  const uploadedThumbnail = thumbnailFile
    ? await uploadFile(thumbnailFile, userId)
    : null;

  const designData = {
    ...req.body,
    user: userId,
    thumbnail: uploadedThumbnail?.url,
    images: uploadedImages.map((file) => file.url),
  };

  const design = await createDesignShowcase(designData);

  return successResponse(
    res,
    200,
    "Design showcase created successfully",
    design,
  );
});

export const getAllDesigns = asyncHandler(async (req, res) => {
  const pageParam = req.query.page as string;
  const limitParam = req.query.limit as string;
  const category = req.query.category as string | undefined;

  const { page, limit } = getPagination(pageParam, limitParam);
  const userId = req.user?.id;
  const designs = await getDesignShowcases({ page, limit, userId, category });
  return successResponse(
    res,
    200,
    "Design showcases fetched successfully",
    designs,
  );
});

export const getDesignDetails = asyncHandler(async (req, res) => {
  const userId = req.user!.id;
  const designId = req.params.designId as string;
  const design = await getDesignById(designId);


  const isLiked = userId
    ? await hasUserLikedDesign({ designId, userId })
    : false;

  const details = { ...design, isLiked: !!isLiked };

  return successResponse(res, 200, "Design details fetched", details);
});

export const designShowcaseStats = asyncHandler(async (req, res) => {
  const stats = await getDesignShowcaseStats();

  return successResponse(res, 200, "Stats fetched", stats);
});

export const getUserDesignsPaginated = asyncHandler(async (req, res) => {
  const userId = req.params.userId as string;
  const pageParam = req.query.page as string;
  const limitParam = req.query.limit as string;

  const { page, limit } = getPagination(pageParam, limitParam);

  const designData = await findUserDesignsPaginated({ userId, page, limit });

  return successResponse(res, 200, "Designs fetched", designData);
});
