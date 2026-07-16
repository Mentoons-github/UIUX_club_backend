// modules/chat/message.model.ts
import mongoose, { Schema } from "mongoose";

const messageSchema = new Schema(
  {
    conversationId: {
      type: Schema.Types.ObjectId,
      ref: "Conversation",
      required: true,
    },

    senderId: {
      type: Schema.Types.ObjectId,
      required: true,
      refPath: "senderType",
    },

    senderType: {
      type: String,
      required: true,
      enum: ["User", "Employer", "SubEmployer"],
    },

    senderName: {
      type: String,
      required: true,
    },

    receiverId: {
      type: Schema.Types.ObjectId,
      required: true,
      refPath: "receiverType",
    },

    receiverType: {
      type: String,
      required: true,
      enum: ["User", "Employer"],
    },

    type: {
      type: String,
      enum: ["text", "image", "audio", "video", "file", "resume", "assignment"],
      default: "text",
    },

    content: {
      type: String,
      default: "",
    },

    fileUrl: {
      type: String,
      default: null,
    },

    fileName: {
      type: String,
      default: null,
    },

    fileSize: {
      type: Number,
      default: null,
    },

    mimeType: {
      type: String,
      default: null,
    },

    deliveredAt: {
      type: Date,
      default: null,
    },

    seenAt: {
      type: Date,
      default: null,
    },

    forwarded: {
      type: Boolean,
      default: false,
    },

    forwardedFrom: {
      participantId: {
        type: Schema.Types.ObjectId,
        refPath: "forwardedFrom.participantType",
      },
      participantType: {
        type: String,
        enum: ["User", "Employer"],
      },
    },
  },
  {
    timestamps: true,
  },
);

messageSchema.index({
  conversationId: 1,
  createdAt: -1,
});

messageSchema.index({
  receiverId: 1,
  seenAt: 1,
});

export const MessageModel = mongoose.model("Message", messageSchema);
