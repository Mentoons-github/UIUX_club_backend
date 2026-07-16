import mongoose from "mongoose";
import { SUB_EMPLOYER_PERMISSIONS } from "./subEmployer.constants";

const subEmployerSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    mobile: {
      type: String,
      required: true,
      trim: true,
    },

    password: {
      type: String,
      default: null,
    },

    assignedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employer",
      required: true,
    },

    permissions: {
      type: [
        {
          type: String,
          enum: Object.values(SUB_EMPLOYER_PERMISSIONS),
        },
      ],
      default: Object.values(SUB_EMPLOYER_PERMISSIONS),
    },

    status: {
      type: String,
      enum: ["INVITED", "ACTIVE", "DISABLED"],
      default: "INVITED",
    },

    invitationToken: {
      type: String,
      default: null,
    },

    invitationExpires: {
      type: Date,
      default: null,
    },

    lastLogin: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  },
);

const SubEmployerModel = mongoose.model("SubEmployer", subEmployerSchema);

export default SubEmployerModel;
