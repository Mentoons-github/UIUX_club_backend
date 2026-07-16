import jwt from "jsonwebtoken";
import { JwtPayload } from "../modules/auth";
import { env } from "../config/env";

export const accessToken = (payload: JwtPayload) => {
  return jwt.sign(
    {
      id: payload.id,
      role: payload.role,
      permissions: payload.permissions ?? [],
    },
    env.ACCESS_TOKEN_SECRET as string,
    {
      expiresIn: "15m",
    },
  );
};

export const refreshToken = (payload: JwtPayload) => {
  return jwt.sign(
    {
      id: payload.id,
      role: payload.role,
      permissions: payload.permissions ?? [],
    },
    env.REFRESH_TOKEN_SECRET as string,
    { expiresIn: "7d" },
  );
};
export const verifyToken = (token: string) => {
  return jwt.verify(token, env.ACCESS_TOKEN_SECRET!);
};

export const refreshTokenVerify = (token: string) => {
  return jwt.verify(token, env.REFRESH_TOKEN_SECRET as string) as JwtPayload;
};
