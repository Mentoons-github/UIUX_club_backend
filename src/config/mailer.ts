import nodemailer from "nodemailer";
import { env } from "./env";

export const transport = nodemailer.createTransport({
  host: "smtpout.secureserver.net",
  port: 465,
  secure: true,
  auth: {
    user: env.EMAIL_USER,
    pass: env.EMAIL_PASS,
  },
  tls: {
    rejectUnauthorized: false,
  },
});

transport.verify((err, success) => {
  if (err) {
    console.error("❌ Failed to connect to Gmail:", err);
  } else {
    console.log("✅ Email server is ready");
  }
});
