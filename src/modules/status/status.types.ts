import { Types } from "mongoose";

export interface Status {
  _id: string;
  user: Types.ObjectId;
  type: "text" | "image" | "video";
  text?: string;
  backgroundColor?: string;
  textColor?: string;
  media?: {
    url: string;
  };
  caption?: string;
  viewers: {
    user: Types.ObjectId;
    viewedAt: Date;
  }[];
  viewersCount: number;
  expiresAt: Date;
  createdAt: Date;
  updatedAt: Date;
}
