import { generateRandomToken, hashToken } from "../../utils";
import AppError from "../../utils/AppError";
import { TOKEN_TTL_MS } from "../emailVerification";
import { findUserByEmail, findUserByPhone } from "../user";
import EmployerModel from "./employer.model";

export const addBlockedUser = async ({
  userId,
  employerId,
}: {
  userId: string;
  employerId: string;
}) => {
  if (!userId) throw new AppError("No user found to block", 404);

  const employer = await EmployerModel.findByIdAndUpdate(employerId, {
    $addToSet: { blockedUsers: userId },
  });

  if (!employer) {
    throw new AppError("Employer not found", 404);
  }

  return true;
};

export const removeUnBlockedUser = async ({
  userId,
  employerId,
}: {
  userId: string;
  employerId: string;
}) => {
  if (!userId) throw new AppError("No user found to block", 404);

  const employer = await EmployerModel.findByIdAndUpdate(employerId, {
    $pull: { blockedUsers: userId },
  });

  if (!employer) {
    throw new AppError("Employer not found", 404);
  }

  return true;
};

export const findEmployerByIdStrict = async (employerId: string) => {
  if (!employerId) throw new AppError("No employer found", 404);

  const employer = await EmployerModel.findById(employerId);

  if (!employer) throw new AppError("No employer found", 404);

  return employer;
};

export const getCurrentEmployerBlockedIds = async (employerId: string) => {
  const doc = await EmployerModel.findById(employerId)
    .select("blockedUsers")
    .lean();

  return new Set([...(doc?.blockedUsers || [])].map(String));
};

export const getOtherEmployersBlockMap = async (employerIds: string[]) => {
  const employers = await EmployerModel.find({ _id: { $in: employerIds } })
    .select("blockedUsers")
    .lean();

  const map = new Map<string, Set<string>>();
  employers.forEach((doc: any) => {
    map.set(
      doc._id.toString(),
      new Set([...(doc.blockedUsers || [])].map(String)),
    );
  });

  return map;
};

export const editEmployerProfile = async (
  employerId: string,
  updateData: Record<string, unknown>,
) => {
  const { workEmail, mobile, whatsapp } = updateData;

  if (workEmail) {
    const [existingEmployer, existingUser] = await Promise.all([
      EmployerModel.findOne({
        _id: { $ne: employerId },
        workEmail,
      }).lean(),
      findUserByEmail(workEmail as string),
    ]);

    if (existingEmployer || existingUser) {
      throw new AppError("This email address is already in use.", 400);
    }
  }

  if (mobile) {
    const [existingEmployer, existingUser] = await Promise.all([
      EmployerModel.findOne({
        _id: { $ne: employerId },
        mobile,
      }).lean(),
      findUserByPhone(mobile as string),
    ]);

    if (existingEmployer || existingUser) {
      throw new AppError("This mobile number is already in use.", 400);
    }
  }

  if (whatsapp) {
    const existingEmployer = await EmployerModel.findOne({
      _id: { $ne: employerId },
      whatsapp,
    }).lean();

    if (existingEmployer) {
      throw new AppError("This WhatsApp number is already in use.", 400);
    }
  }

  const employer = await EmployerModel.findByIdAndUpdate(
    employerId,
    updateData,
    {
      new: true,
      runValidators: true,
    },
  ).select("-blockedUsers -password -__v");

  if (!employer) {
    throw new AppError("Employer not found", 404);
  }

  return employer;
};

export const getEmployerProfile = async (employerId: string) => {
  const employer = await EmployerModel.findById(employerId).select(
    "-blockedUsers -password -__v",
  );
  if (!employer) {
    throw new AppError("Employer not found", 404);
  }
  return employer;
};

export const createEmailVerificationToken = async (
  employerId: string,
  email: string,
) => {
  const token = generateRandomToken(32);
  const tokenHash = hashToken(token);

  await EmployerModel.findByIdAndUpdate(employerId, {
    pendingWorkEmail: email,
    emailVerificationTokenHash: tokenHash,
    emailVerificationExpires: new Date(Date.now() + TOKEN_TTL_MS),
  });

  return token;
};

export const verifyEmailToken = async (token: string) => {
  const tokenHash = hashToken(token);

  const employer = await EmployerModel.findOne({
    emailVerificationTokenHash: tokenHash,
    emailVerificationExpires: { $gt: new Date() },
  });

  if (!employer) throw new AppError("Invalid or expired token", 400);

  employer.workEmail = employer.pendingWorkEmail!;
  employer.isWorkEmailVerified = true;
  employer.pendingWorkEmail = undefined;
  employer.emailVerificationTokenHash = undefined;
  employer.emailVerificationExpires = undefined;
  await employer.save();

  return employer;
};

export const getEmployerById = async (employerId: string) => {
  const employer = await EmployerModel.findById(employerId);
  if (!employer) throw new AppError("No employer found", 404);

  return employer;
};
