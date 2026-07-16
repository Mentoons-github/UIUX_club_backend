import type { Request, Response } from "express";
import { successResponse } from "../../utils";
import { getLinkPreviewService } from "./linkPreview.service";
import asyncHandler from "express-async-handler";

export const getLinkPreview = asyncHandler(
  async (req: Request, res: Response) => {
    const { url } = req.query;

    if (!url || typeof url !== "string") {
      return res.status(400).json({
        message: "URL is required.",
      });
    }

    const data = await getLinkPreviewService(url);

    return successResponse(res, 200, "Link fetched details", data);
  },
);
