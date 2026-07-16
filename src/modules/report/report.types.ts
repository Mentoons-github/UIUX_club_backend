import { Document, Types } from "mongoose";

export type ReporterType = "User" | "Employer";

export type ReportReason =
  | "Spam"
  | "Harassment"
  | "Fake Profile"
  | "Inappropriate Content"
  | "Scam"
  | "Other";

export type ReportStatus = "Pending" | "Reviewed" | "Resolved" | "Rejected";

export interface IReport extends Document {
  reporterId: Types.ObjectId;
  reporterType: ReporterType;

  reportedId: Types.ObjectId;
  reportedType: ReporterType;

  reason: ReportReason;
  description?: string;

  status: ReportStatus;

  reviewedBy?: Types.ObjectId;
  reviewedAt?: Date;
  adminNote?: string;

  createdAt: Date;
  updatedAt: Date;
}

export interface CreateReportPayload {
  reporterId: string;
  reporterType: "User" | "Employer";
  reportedId: string;
  reportedType: "User" | "Employer";
  reason:
    | "Spam"
    | "Harassment"
    | "Fake Profile"
    | "Inappropriate Content"
    | "Scam"
    | "Other";
  description?: string;
}
