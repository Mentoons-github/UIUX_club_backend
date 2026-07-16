import { ROLES } from "../../constants/roles.constants";
import {
  comparePassword,
  generateRandomToken,
  hashPassword,
  sendEmail,
} from "../../utils";
import AppError from "../../utils/AppError";
import { accessToken } from "../../utils/jwt";
import { issueEmployerAuthToken } from "../employer";
import { findUserByEmail } from "../user";
import { SubEmployerStatus } from "./subEmployer.constants";
import SubEmployerModel from "./subEmployer.model";
import { IRegisterSubEmployer } from "./subEmployer.types";

export const createSubEmployerInvitation = async (
  data: IRegisterSubEmployer,
  employerId: string,
) => {
  console.log(employerId);
  console.log("checking employer");
  if (!employerId) throw new AppError("Employer ID is required", 400);

  console.log("checking user");
  const user = await findUserByEmail(data.email);

  console.log("user found  email already taken:", user);

  if (user) throw new AppError("This email is already registered", 400);

  console.log("user not found");
  const invitationToken = generateRandomToken();

  const invitationExpires = new Date();
  invitationExpires.setDate(invitationExpires.getDate() + 7);

  console.log("creating token");
  const invitation = await SubEmployerModel.create({
    ...data,
    assignedBy: employerId,
    status: SubEmployerStatus.INVITED,
    invitationToken,
    invitationExpires,
  });

  const invitationLink = `${process.env.CLIENT_URL}/employer/reset/${invitationToken}`;

  const mailData = {
    to: data.email,
    from: "UIUX CLUB<hr@mentoons.com>",
    subject: "Sub-employer Invitation",
    text: `You have been invited to join as a sub-employer. Click the link below to set your password and accept the invitation:\n\n${invitationLink}\n\nThis link expires in 7 days.`,
  };

  await sendEmail(mailData);

  return invitation;
};

export const acceptInvitation = async (token: string, password: string) => {
  const subEmployer = await SubEmployerModel.findOne({
    invitationToken: token,
    invitationExpires: { $gt: new Date() },
  });

  if (!subEmployer) {
    throw new AppError("Invalid or expired invitation token", 400);
  }

  const hashedPassword = await hashPassword(password);

  subEmployer.status = SubEmployerStatus.ACTIVE;
  subEmployer.password = hashedPassword;

  await subEmployer.save();

  return subEmployer;
};

export const getEmployerSubEmployers = async (employerId: string) => {
  if (!employerId) throw new AppError("No employer found", 404);

  const subUsers = await SubEmployerModel.find({ assignedBy: employerId });

  return subUsers;
};

export const loginSubEmployer = async (email: string, password: string) => {
  const subEmployer = await SubEmployerModel.findOne({ email }).populate<{
    assignedBy: { companyName: string };
  }>("assignedBy", "companyName");

  if (!subEmployer) {
    return null;
  }

  if (!subEmployer.password) {
    throw new AppError("Please complete your invitation setup first", 401);
  }

  const isMatch = await comparePassword(password, subEmployer.password);
  if (!isMatch) {
    throw new AppError("Invalid email or password", 401);
  }

  if (subEmployer.status === "DISABLED") {
    throw new AppError("Account is disabled", 403);
  }

  console.log("embedding permission to the token");

  const { accessToken, refreshToken } = issueEmployerAuthToken(
    subEmployer._id.toString(),
    ROLES.SUB_EMPLOYER,
    subEmployer.permissions,
  );

  subEmployer.lastLogin = new Date();
  if (subEmployer.status === "INVITED") {
    subEmployer.status = "ACTIVE";
  }
  await subEmployer.save();

  return {
    accessToken,
    refreshToken,
    employer: {
      role: ROLES.SUB_EMPLOYER,
      _id: subEmployer._id.toString(),
      email: subEmployer.email,
      name: subEmployer.name,
      permissions: subEmployer.permissions,
      companyName: subEmployer.assignedBy.companyName,
    },
  };
};

export const generateSubEmployerAccessToken = async (id: string) => {
  const subEmployer = await SubEmployerModel.findById(id).populate<{
    assignedBy: { companyName: string };
  }>("assignedBy", "companyName");

  if (!subEmployer) {
    throw new AppError("Sub-employer not found", 404);
  }

  if (subEmployer.status === "DISABLED") {
    throw new AppError("Account is disabled", 403);
  }

  const authAccessToken = accessToken({
    id: subEmployer._id.toString(),
    role: ROLES.SUB_EMPLOYER,
    permissions: subEmployer.permissions,
  });

  return {
    accessToken: authAccessToken,
    employer: {
      role: ROLES.SUB_EMPLOYER,
      _id: subEmployer._id.toString(),
      email: subEmployer.email,
      name: subEmployer.name,
      permissions: subEmployer.permissions,
      companyName: subEmployer.assignedBy.companyName,
    },
  };
};

export const getSubEmployerCompanyId = async (subEmployerId: string) => {
  const subEmployer =
    await SubEmployerModel.findById(subEmployerId).select("assignedBy");
  return subEmployer?.assignedBy?.toString() || null;
};

export const getSubEmployerContext = async (subEmployerId: string) => {
  const subEmployer =
    await SubEmployerModel.findById(subEmployerId).select("name assignedBy");

  if (!subEmployer) {
    throw new AppError("Sub employer not found", 404);
  }

  return {
    name: subEmployer.name,
    assignedBy: subEmployer.assignedBy,
  };
};

export const getSubEmployerById = async (id: string) => {
  const subEmployer = await SubEmployerModel.findById(id);
  if (!subEmployer) throw new AppError("Sub employer not found", 404);

  return subEmployer;
};
