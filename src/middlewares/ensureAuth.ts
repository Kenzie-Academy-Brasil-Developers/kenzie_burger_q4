import { Request, Response, NextFunction, request } from "express";
import { verify } from "jsonwebtoken";
import authConfig from "../config/auth";
import AppError from "../errors/AppError";

interface TokenPayload {
  iat: number;
  exp: number;
  sub: string;
}

export default function ensureAuth(
  request: Request,
  response: Response,
  next: NextFunction
): void {
  const authHeader = request.headers.authorization;

  if (!authHeader) {
    throw new AppError("JWT is missing", 401);
  }

  try {
    const [, token] = authHeader.split(" ");
    const { secret } = authConfig.jwt;

    const decoded = verify(token, secret);
    const { sub } = decoded as TokenPayload;

    request.user = {
      id: sub,
    };

    return next();
  } catch (err) {
    throw new AppError("JWT Expired or sended in a wrong way");
  }
}
