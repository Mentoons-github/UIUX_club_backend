import asyncHandler from "express-async-handler";
import {
  fetchStatus,
  recordStatusView,
  statusSeenUsers,
  statusUpload,
} from "./status.service";
import { successResponse } from "../../utils";
import { uploadFiles } from "../media";

export const createStatus = asyncHandler(async (req, res) => {
  console.log("creating status");
  const userId = req.user!.id;

  let media;
  const files = req.files as Express.Multer.File[] | undefined;
  console.log(req.body);
  if (req.body.type != "text") {
    const uploadedMedia = await uploadFiles(files || [], userId);
    media = {
      url: uploadedMedia[0].url,
    };
  }

  const data = {
    ...req.body,
    ...(media && { media }),
  };
  console.log("upload");
  const uploadedStatus = await statusUpload({ userId, data });
  return successResponse(res, 200, "Status uploaded", uploadedStatus);
});

export const getStatus = asyncHandler(async (req, res) => {
  const userId = req.user!.id;
  console.log(userId);
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;
  const statuses = await fetchStatus({ page, limit, userId });
  return successResponse(res, 200, "Status fetched", statuses);
});

export const viewStatus = asyncHandler(async (req, res) => {
  const userId = req.user!.id;
  const { statusIds } = req.body;
  const status = await recordStatusView({ userId, statusIds });
  return successResponse(res, 200, "status viewed", status);
});

export const getStatusViewedUsers = asyncHandler(async (req, res) => {
  const statusId = req.params.statusId as string;
  const userList = await statusSeenUsers(statusId);
  return successResponse(res, 200, "status viewed userLists fetched", userList);
});
