import asyncHandler from "express-async-handler";
import {
  acceptInvitation,
  createSubEmployerInvitation,
  getEmployerSubEmployers,
} from "./subEmployer.service";
import { successResponse } from "../../utils";

export const sendSubEmployerInvitation = asyncHandler(async (req, res) => {
  const data = req.body;
  const employerId = req.user!.id;
  console.log("employerId found :", employerId);

  const invitation = await createSubEmployerInvitation(data, employerId);

  return successResponse(
    res,
    201,
    "Sub-employer invitation sent successfully",
    invitation,
  );
});

export const acceptSubEmployerInvitation = asyncHandler(async (req, res) => {
  const { token } = req.params as { token: string };
  const { password } = req.body;

  const subEmployer = await acceptInvitation(token, password);

  return successResponse(
    res,
    200,
    "Sub-employer invitation accepted successfully",
    subEmployer,
  );
});

export const getMySubEmployers = asyncHandler(async (req, res) => {
  const employerId = req.user!.id;

  const subEmployers = await getEmployerSubEmployers(employerId);

  return successResponse(res, 200, "Sub employers fetched", subEmployers);
});
