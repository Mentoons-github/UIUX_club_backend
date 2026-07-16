import asyncHandler from "express-async-handler";
import {
  addBlockedUser,
  editEmployerProfile,
  getEmployerProfile,
  removeUnBlockedUser,
} from "./employer.service";
import { successResponse } from "../../utils";
import { uploadFile } from "../media";
import { EDITABLE_FIELDS } from "./employer.constants";

export const employerBlockUser = asyncHandler(async (req, res) => {
  const userId = req.params.userId as string;
  const employerId = req.user!.id;

  await addBlockedUser({ userId, employerId });

  return successResponse(res, 200, "User blocked");
});

export const employerUnBlockUser = asyncHandler(async (req, res) => {
  const userId = req.params.userId as string;
  const employerId = req.user!.id;

  await removeUnBlockedUser({ userId, employerId });

  return successResponse(res, 200, "User unblocked");
});

export const employerProfile = asyncHandler(async (req, res) => {
  const employerId = req.user!.id;
  const employer = await getEmployerProfile(employerId);
  return successResponse(res, 200, "Employer profile retrieved", employer);
});

export const employerEditProfile = asyncHandler(async (req, res) => {
  const employerId = req.user!.id;

  const updateData: Record<string, unknown> = {};
  for (const field of EDITABLE_FIELDS) {
    if (req.body[field] !== undefined) {
      updateData[field] = req.body[field];
    }
  }

  if (req.file) {
    const uploaded = await uploadFile(req.file, "employer-profile-pictures");
    updateData.profilePicture = uploaded.url;
  }

  const updatedProfile = await editEmployerProfile(employerId, updateData);
  return successResponse(res, 200, "Employer profile updated", updatedProfile);
});
