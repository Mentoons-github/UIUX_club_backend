import mongoose from "mongoose";

export type ParticipantType = "User" | "Employer";
export type SenderRole = "User" | "Employer" | "SubEmployer";

export type MessageType =
  | "text"
  | "image"
  | "audio"
  | "video"
  | "file"
  | "resume"
  | "assignment";

export interface IParticipant {
  participantId: mongoose.Types.ObjectId;
  participantType: ParticipantType;
}

export interface IConversation {
  participants: IParticipant[];
  lastMessage?: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

export interface IMessage {
  conversationId: mongoose.Types.ObjectId;
  senderId: mongoose.Types.ObjectId;
  senderType: SenderRole;
  senderName: string;
  receiverId: mongoose.Types.ObjectId;
  receiverType: ParticipantType;
  type: MessageType;
  content?: string;
  fileUrl?: string;
  fileName?: string;
  fileSize?: number;
  mimeType?: string;
  deliveredAt?: Date | null;
  seenAt?: Date | null;
  forwarded: boolean;
  forwardedFrom?: {
    participantId: mongoose.Types.ObjectId;
    participantType: ParticipantType;
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface SocketFilePayload {
  buffer: ArrayBuffer | Buffer;
  originalname: string;
  mimetype: string;
  size: number;
}

export interface SendMessagePayload {
  conversationId?: string;
  receiverId: string;
  receiverType: ParticipantType;
  type: MessageType;
  content?: string;
  file?: SocketFilePayload;
}

export interface SenderContext {
  senderId: string;
  senderType: SenderRole;
  senderName: string;
  conversationParticipantId: string;
  conversationParticipantType: ParticipantType;
}

export interface CreateMessageParams {
  senderId: string;
  senderType: SenderRole;
  senderName: string;
  conversationParticipantId: string;
  conversationParticipantType: ParticipantType;
  receiverId: string;
  receiverType: ParticipantType;
  conversationId?: string;
  type: MessageType;
  content?: string;
}
