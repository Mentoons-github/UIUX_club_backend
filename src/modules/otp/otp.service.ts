import { generateOTP, hashPassword, sendEmail } from "../../utils";
import AppError from "../../utils/AppError";
import {
  EnsureAuthSessionInput,
  IForgotPasswordOtpRequest,
  IRegisterOtpRequest,
  SendOtpInput,
} from "../auth";
import { OtpPurpose, VerifyOTPInput } from "./otp.types";
import OTPAuthSessionModel from "./otpAuthSession.model";

export const sendOTP = async (data: SendOtpInput) => {
  const otp = generateOTP();

  console.log("OTP generated");
  let hashedPassword: string | undefined;
  let hashedEmployerPassword: string | undefined;

  if (data.purpose === "register") {
    hashedPassword = await hashPassword(data.password);
  }

  if (data.purpose === "employer-register") {
    console.log(data)
    console.log("password :", data.password)
    hashedEmployerPassword = await hashPassword(data.password);
  }

  console.log("hashed employee password");
  const sessionPayload: EnsureAuthSessionInput =
    data.purpose === "register"
      ? {
          email: data.email,
          purpose: "register",
          otp,
          firstName: data.firstName,
          lastName: data.lastName,
          hashedPassword: hashedPassword!,
        }
      : data.purpose === "employer-register"
        ? {
            email: data.email,
            purpose: "employer-register",
            otp,
            employerData: {
              ...data,
              password: hashedEmployerPassword!,
            },
          }
        : {
            email: data.email,
            purpose: data.purpose,
            otp,
          };

  console.log("session payload:", sessionPayload);

  await upsertOTPAuthSession(sessionPayload);

  console.log("session uploaded");

  const recipientName =
    data.purpose === "register" || data.purpose === "employer-register"
      ? data.firstName
      : "User";

  const mailOptions = {
    from: "UIUX Club <hr@mentoons.com>",
    to: data.email,
    subject: "OTP Verification Code",
    text: `Hello ${recipientName},

Your OTP for verification is: ${otp}

This OTP is valid for 5 minutes.

- UIUX Club Team`,
  };
  console.log(mailOptions);

  try {
    await sendEmail(mailOptions);
  } catch (err) {
    console.log(err)
    await deleteOTPAuthSession({
      email: data.email,
      purpose: data.purpose,
    });

    throw new AppError("Failed to send OTP. Please try again.", 500);
  }

  return { email: data.email };
};

export const verifyOTP = async (data: VerifyOTPInput) => {
  const { otp, email, purpose } = data;

  if (!otp) throw new AppError("Please enter OTP", 400);

  if (!/^\d{6}$/.test(otp)) {
    throw new AppError("Invalid OTP format", 400);
  }

  const session = await OTPAuthSessionModel.findOne({ email, purpose });

  if (!session) throw new AppError("Invalid OTP or email", 400);

  if (session.otp !== otp) throw new AppError("Incorrect OTP", 400);

  if (session.expiresAt < new Date()) {
    throw new AppError("OTP expired", 400);
  }

  return { session };
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

  const updatePayload: any = {
    email: data.email,
    purpose: data.purpose,
    otp: data.otp,
    expiresAt: new Date(Date.now() + 5 * 60 * 1000),
    lastSentAt: now,
  };

  if (data.purpose === "register") {
    if (data.firstName) updatePayload.firstName = data.firstName;
    if (data.lastName) updatePayload.lastName = data.lastName;
    if (data.hashedPassword) updatePayload.password = data.hashedPassword;
  }

  if (data.purpose === "employer-register") {
    updatePayload.employerData = data.employerData;
  }

  const authSession = await OTPAuthSessionModel.findOneAndUpdate(
    {
      email: data.email,
      purpose: data.purpose,
    },
    updatePayload,
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

export const OTPResend = async (email: string, purpose: OtpPurpose) => {
  const otp = generateOTP();

  await OTPAuthSessionModel.findOneAndUpdate(
    { email, purpose },
    {
      otp,
      expiresAt: new Date(Date.now() + 5 * 60 * 1000),
    },
  );

  try {
    await sendEmail({
      from: "UIUX Club <hr@mentoons.com>",
      to: email,
      subject: "OTP Resend",
      text: `Your new OTP is ${otp}`,
    });
  } catch (err) {
    console.log("Error sending OTP resend email:", err);
    throw new AppError("Failed to resend OTP. Please try again.", 500);
  }

  return { email };
};
