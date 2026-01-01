import { NextFunction, Request, Response } from "express";
import ApiError from "../errors/ApiError";
import status from "http-status";
import { jwtHelpers } from "../helpers/jwtHelper";
import config from "../config";
import { Secret } from "jsonwebtoken";
import jwt from "jsonwebtoken";

const auth = (...roles: string[]) => {
  return async (
    req: Request & { user?: any },
    res: Response,
    next: NextFunction
  ) => {
    try {
      const token = req.headers.authorization;

      if (!token) {
        throw new ApiError(status.UNAUTHORIZED, "You are not authorized", "");
      }

      const verifUser = jwtHelpers.verifyToken(
        token as string,
        config.jwt.access_token_secret as string
      );
      req.user = verifUser;

      if (
        roles.length &&
        typeof verifUser !== "string" &&
        !roles.includes(verifUser.role)
      ) {
        throw new ApiError(status.FORBIDDEN, "Forbidden errors", "");
      }
      next();
    } catch (error) {
      next(error);
    }
  };
};

export default auth;
