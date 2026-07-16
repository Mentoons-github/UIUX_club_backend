import mongoose from "mongoose";

const NotificationSchema = new mongoose.Schema(
  {
    receiver: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      refPath: "receiverModel",
    },

    receiverModel: {
      type: String,
      required: true,
      enum: ["User", "Employer", "SubEmployer", "Admin"],
    },

    sender: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      refPath: "senderModel",
    },

    senderModel: {
      type: String,
      required: true,
      enum: ["User", "Employer", "SubEmployer", "Admin"],
    },

    type: {
      type: String,
      enum: [
        "job_application",
        "application_status",
        "message",
        "interview",
        "job_expiry",
        "job_approved",
        "job_rejected",
        "assignment",
        "system",
      ],
      required: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
    },

    message: {
      type: String,
      required: true,
      trim: true,
    },

    link: {
      type: String,
      default: "",
    },

    image: {
      type: String,
      default: "",
    },

    // Any related document (Job, Application, Message, etc.)
    entityId: {
      type: mongoose.Schema.Types.ObjectId,
      default: null,
    },

    entityType: {
      type: String,
      enum: [
        "Job",
        "Application",
        "Interview",
        "Conversation",
        "Message",
        "Assignment",
      ],
      default: null,
    },

    // Read status
    isRead: {
      type: Boolean,
      default: false,
    },

    // Read timestamp
    readAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true },
);

const NotificationModel = mongoose.model("Notifications", NotificationSchema);

export default NotificationModel;
