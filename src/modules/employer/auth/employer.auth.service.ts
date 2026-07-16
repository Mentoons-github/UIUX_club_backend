import AppError from "../../../utils/AppError";
import { accessToken, refreshToken } from "../../../utils/jwt";
import { comparePassword } from "../../../utils";
import { verifyRefreshToken } from "../../auth";
import EmployerModel from "../employer.model";
import {
  generateSubEmployerAccessToken,
  loginSubEmployer,
} from "../../subEmployer";
import { ROLES } from "../../../constants/roles.constants";

export const loginEmployer = async (email: string, password: string) => {
  const employer = await EmployerModel.findOne({ workEmail: email });

  if (employer) {
    const isMatch = await comparePassword(password, employer.password);
    if (!isMatch) {
      throw new AppError("Invalid email or password", 401);
    }
    if (employer.isBlocked) {
      throw new AppError("Account is blocked", 403);
    }

    const { accessToken, refreshToken } = issueEmployerAuthToken(
      employer._id.toString(),
      ROLES.EMPLOYER,
    );

    return {
      accessToken,
      refreshToken,
      employer: {
        role: ROLES.EMPLOYER,
        _id: employer._id.toString(),
        email: employer.workEmail,
        companyName: employer.companyName,
        firstName: employer.firstName,
        lastName: employer.lastName,
        permissions: [],
      },
    };
  }

  console.log("no employer found");
  const subEmployerResult = await loginSubEmployer(email, password);

  console.log(subEmployerResult);
  if (subEmployerResult) {
    return subEmployerResult;
  }

  throw new AppError("Invalid email or password", 401);
};

export const createEmployerAccount = async (data: any) => {
  const exists = await EmployerModel.findOne({ workEmail: data.workEmail });
  if (exists) {
    throw new AppError("Employer already exists. Please login", 400);
  }

  const employer = await EmployerModel.create(data);

  const { accessToken: authAccessToken, refreshToken: authRefreshToken } =
    issueEmployerAuthToken(employer._id.toString(), employer.role);

  return {
    employer,
    accessToken: authAccessToken,
    refreshToken: authRefreshToken,
  };
};

export const issueEmployerAuthToken = (
  employerId: string,
  role: string,
  permissions: string[] = [],
) => {
  const payload = { id: employerId, role, permissions };

  console.log(payload);
  return {
    accessToken: accessToken(payload),
    refreshToken: refreshToken(payload),
  };
};

export const generateNewEmployerAccessToken = async (token: string) => {
  const decoded = verifyRefreshToken(token);

  if (decoded.role === ROLES.SUB_EMPLOYER) {
    return generateSubEmployerAccessToken(decoded.id);
  }

  const employer = await EmployerModel.findById(decoded.id);

  if (!employer) {
    throw new AppError("Employer not found", 404);
  }

  if (employer.isBlocked) {
    throw new AppError("Account is blocked", 403);
  }

  const authAccessToken = accessToken({
    id: employer._id.toString(),
    role: ROLES.EMPLOYER,
    permissions: [],
  });

  return {
    accessToken: authAccessToken,
    employer: {
      role: ROLES.EMPLOYER,
      _id: employer._id.toString(),
      email: employer.workEmail,
      companyName: employer.companyName,
      firstName: employer.firstName,
      lastName: employer.lastName,
      permissions: [],
    },
  };
};

export const getEmployerByEmailStrictCheck = async (email: string) => {
  const exists = await EmployerModel.findOne({ workEmail: email });
  if (exists) {
    throw new AppError("Employer already exists. Please login", 400);
  }
  return exists;
};
