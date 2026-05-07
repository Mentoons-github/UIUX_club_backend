import { transport } from "../config/mailer";
import { SendMail } from "../types/auth.types";

export const sendEmail = async (mailDetails: SendMail) => {
  const send = await transport.sendMail(mailDetails);
  console.log(send);
  return send;
};
