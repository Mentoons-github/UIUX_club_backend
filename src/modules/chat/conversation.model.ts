import mongoose, { Schema, Document } from "mongoose";
import { IParticipant } from "./message.types";

const participantSchema = new Schema(
  {
    participantId: {
      type: Schema.Types.ObjectId,
      required: true,
      refPath: "participants.participantType",
    },
    participantType: {
      type: String,
      required: true,
      enum: ["User", "Employer"],
    },
  },
  {
    _id: false,
  },
);

const conversationSchema = new mongoose.Schema(
  {
    participants: {
      type: [participantSchema],
      validate: {
        validator: (participants: IParticipant[]) => participants.length === 2,
        message: "Conversation must have exactly 2 participants",
      },
      required: true,
    },

    lastMessage: {
      type: Schema.Types.ObjectId,
      ref: "Message",
      default: null,
    },
  },
  {
    timestamps: true,
  },
);

conversationSchema.index({
  "participants.participantId": 1,
});

export const ConversationModel = mongoose.model(
  "Conversation",
  conversationSchema,
);
