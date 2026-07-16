import asyncHandler from "express-async-handler";
import { dislikeDesign, likeDesign } from "./designLike.service";
import { successResponse } from "../../../utils";

export const addDesignLike = asyncHandler(async (req, res) => {
  const userId = req.user!.id;
  const designId = req.params.designId as string;

  await likeDesign(userId, designId);
  return successResponse(res, 200, "Design liked");
});

export const addDesignDisLike = asyncHandler(async (req, res) => {
  const userId = req.user!.id;
  const designId = req.params.designId as string;

  await dislikeDesign(userId, designId);
  return successResponse(res, 200, "Design liked");
});
