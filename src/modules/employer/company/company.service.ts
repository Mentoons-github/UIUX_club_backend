import AppError from "../../../utils/AppError";
import CompanyUpdateModel from "./company.model";
import { CompanyUpdatePayload } from "./company.types";

export const createCompanyUpdateRequest = async (
  employerId: string,
  payload: CompanyUpdatePayload,
) => {
  if (!employerId) throw new AppError("Employer not found", 404);

  const existingPending = await CompanyUpdateModel.findOne({
    employerId,
    status: "pending",
  });

  if (existingPending) {
    throw new AppError(
      "You already have a pending company update request",
      409,
    );
  }

  const update = await CompanyUpdateModel.create({
    employerId,
    ...payload,
    status: "pending",
  });

  return update;
};

export const getCompanyUpdateRequestsForEmployer = async (
  employerId: string,
) => {
  if (!employerId) throw new AppError("Employer not found", 404);

  const updates = await CompanyUpdateModel.find({ employerId }).sort({
    createdAt: -1,
  });

  return updates;
};
