import { generateOTP, hashPassword, sendEmail } from "../../utils";
import AppError from "../../utils/AppError";
import { IRegisterRequest, EnsureAuthSessionInput } from "../auth";
import { OtpPurpose, VerifyOTPInput } from "./otp.types";
import { createUser, IUser } from "../user";
import OTPAuthSessionModel from "./otpAuthSession.model";

export const sendOTP = async (
  data: IRegisterRequest & { purpose: OtpPurpose },
) => {
  const { password, ...rest } = data;
  const otp = generateOTP();
  const hashedPassword = await hashPassword(password);

  await upsertOTPAuthSession({
    ...rest,
    hashedPassword,
    otp,
  });

  const mailOptions = {
    from: "UIUX Club <hr@mentoons.com>",
    to: data.email,
    subject: "OTP Verification Code",
    text: `Hello ${data.firstName},

    Your OTP for ${data.purpose} is: ${otp}

    This OTP is valid for 5 minutes.

    If you did not request this, ignore this email.

    - UIUX Club Team`,
  };

  try {
    const result = await sendEmail(mailOptions);
    console.log("result :", result);
  } catch (err) {
    console.log(err);
    await deleteOTPAuthSession({ email: data.email, purpose: data.purpose });
    throw new AppError("Failed to send OTP. Please try again.", 500);
  }

  return {
    email: data.email,
  };
};

export const verifyOTP = async (data: VerifyOTPInput) => {
  console.log(data);
  const { otp, email, purpose } = data;
  if (!otp) {
    throw new AppError("Please enter a valid OTP", 400);
  }

  console.log("otp is there");
  if (!/^\d{6}$/.test(otp)) {
    throw new AppError("Invalid OTP format", 400);
  }

  const session = await OTPAuthSessionModel.findOne({ email, purpose });
  if (!session) {
    throw new AppError("Invalid OTP or email. Please try again.", 400);
  }

  console.log("otp not found");

  if (session.otp != otp) {
    throw new AppError("Invalid OTP", 400);
  }

  console.log("otp is not matching");
  if (session.expiresAt < new Date()) {
    throw new AppError("OTP expired", 400);
  }

  console.log("expired otp");

  console.log("creating user");
  const userData: IUser = {
    email: session.email,
    firstName: session.firstName,
    lastName: session.lastName,
    password: session.password,
  };

  const user = await createUser(userData);
  console.log("user created");

  await deleteOTPAuthSession({ email, purpose });

  return {
    message: "User created successfully",
    user,
  };
};

export const upsertOTPAuthSession = async (data: EnsureAuthSessionInput) => {
  const now = new Date();

  const existingSession = await OTPAuthSessionModel.findOne({
    email: data.email,
    purpose: data.purpose,
  });

  if (
    existingSession &&
    existingSession.lastSentAt &&
    now.getTime() - new Date(existingSession.lastSentAt).getTime() < 60 * 1000
  ) {
    throw new AppError("Please wait 60 seconds before resending OTP", 429);
  }

  const authSession = await OTPAuthSessionModel.findOneAndUpdate(
    {
      email: data.email,
      purpose: data.purpose,
    },
    {
      email: data.email,
      firstName: data.firstName,
      lastName: data.lastName,
      ...(data.hashedPassword && { password: data.hashedPassword }),
      otp: data.otp,
      purpose: data.purpose,
      expiresAt: new Date(Date.now() + 5 * 60 * 1000),
      lastSentAt: now,
    },
    {
      upsert: true,
      new: true,
    },
  );

  return authSession;
};

export const deleteOTPAuthSession = async ({
  email,
  purpose,
}: {
  email: string;
  purpose: OtpPurpose;
}) => {
  try {
    await OTPAuthSessionModel.deleteOne({
      email,
      purpose,
    });
  } catch (error) {
    console.log("auth session delete error :", error);
  }
};
