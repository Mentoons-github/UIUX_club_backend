import { Types } from "mongoose";
import { Role } from "../../types/auth.types";

export type NotificationTypes =
  | "job_application"
  | "application_status"
  | "message"
  | "interview"
  | "job_expiry"
  | "job_approved"
  | "job_rejected"
  | "assignment"
  | "system";

export type NotificationEntityType =
  | "Job"
  | "Application"
  | "Interview"
  | "Conversation"
  | "Message"
  | "Assignment";

export interface INotification {
  receiver: Types.ObjectId;
  receiverModel: Role;

  sender: Types.ObjectId;
  senderModel: Role;

  type: NotificationTypes;

  title: string;
  message: string;

  link: string;
  image: string;

  entityId?: Types.ObjectId | null;
  entityType?: NotificationEntityType | null;

  isRead: boolean;
  readAt?: Date | null;

  createdAt: Date;
  updatedAt: Date;
}

export interface ICreateNotification extends Omit<
  INotification,
  "isRead" | "readAt" | "createdAt" | "updatedAt"
> {}

export interface DeleteNotification {
  receiver: Types.ObjectId;
  receiverModel: Role;

  sender: Types.ObjectId;
  senderModel: Role;
  type: NotificationTypes;
}
