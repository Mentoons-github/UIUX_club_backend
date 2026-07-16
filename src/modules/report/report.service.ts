import AppError from "../../utils/AppError";
import ReportModel from "./report.model";
import { CreateReportPayload } from "./report.types";
import { findUserById } from "../user";
import { findEmployerByIdStrict } from "../employer";

export const createReport = async ({
  reporterId,
  reporterType,
  reportedId,
  reportedType,
  reason,
  description,
}: CreateReportPayload) => {
  if (!reportedId) {
    throw new AppError("Reported account not found", 404);
  }

  if (reporterId === reportedId && reporterType === reportedType) {
    throw new AppError("You cannot report yourself", 400);
  }

  const reporter =
    reporterType === "User"
      ? await findUserById(reporterId)
      : await findEmployerByIdStrict(reporterId);

  if (!reporter) {
    throw new AppError(`${reporterType} not found`, 404);
  }

  const reported =
    reportedType === "User"
      ? await findUserById(reportedId)
      : await findEmployerByIdStrict(reportedId);

  if (!reported) {
    throw new AppError(`${reportedType} not found`, 404);
  }

  const alreadyReported = await ReportModel.findOne({
    reporterId,
    reporterType,
    reportedId,
    reportedType,
  });

  if (alreadyReported) {
    throw new AppError("You have already reported this account", 400);
  }

  return await ReportModel.create({
    reporterId,
    reporterType,
    reportedId,
    reportedType,
    reason,
    description,
  });
};
