import type { Request, Response } from "express";
import { sendEmail } from "../../utils";
import { createEmailVerificationToken, verifyEmailToken } from "../employer";
import { getIO } from "../../config/socket";

export const sendEmailVerification = async (req: Request, res: Response) => {
  const employerId = req.user!.id;
  const { email } = req.body;

  console.log(employerId);

  if (!email) {
    return res.status(400).json({ message: "Email is required" });
  }

  const token = await createEmailVerificationToken(employerId, email);
  const verifyUrl = `${process.env.CLIENT_URL}/employer/verify-email?token=${token}`;

  await sendEmail({
    to: email,
    from: "UIUX Club <hr@mentoons.com>",
    subject: "Verify your work email",
    text: `<p>Click below to verify your work email.</p><a href="${verifyUrl}">Verify email</a><p>This link expires in 30 minutes.</p>`,
  });

  res.json({ message: "Verification email sent" });
};

export const confirmEmailVerification = async (req: Request, res: Response) => {
  const { token } = req.query;

  if (!token || typeof token !== "string") {
    return res.status(400).json({ message: "Invalid token" });
  }

  const employer = await verifyEmailToken(token);

  if (!employer) {
    return res.status(400).json({ message: "Token invalid or expired" });
  }

  getIO().to(employer._id.toString()).emit("email:verified", {
    email: employer.workEmail,
  });

  res.json({ message: "Email verified" });
};
