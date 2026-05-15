import dotenv from "dotenv";
dotenv.config();

export const env = {
  //Server
  PORT: process.env.PORT,
  DB_URI: process.env.DB_URI,
  ACCESS_TOKEN_SECRET: process.env.ACCESS_TOKEN_SECRET,
  REFRESH_TOKEN_SECRET: process.env.REFRESH_TOKEN_SECRET,
  NODE_ENV: process.env.NODE_ENV,

  //Node mailer
  EMAIL_USER: process.env.EMAIL_USER,
  EMAIL_PASS: process.env.EMAIL_PASS,

  //AWS
  AWS_SECRET_KEY: process.env.AWS_SECRET_ACCESS_KEY!,
  AWS_ACCESS_ID: process.env.AWS_ACCESS_KEY_ID!,
  AWS_REGION: process.env.AWS_REGION!,
  AWS_BUCKET_NAME: process.env.AWS_BUCKET_NAME!,
};
