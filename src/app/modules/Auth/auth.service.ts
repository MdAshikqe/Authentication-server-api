import { Secret } from "jsonwebtoken";
import { UserStatus } from "../../../../generated/prisma/enums";
import config from "../../config";
import { jwtHelpers } from "../../helpers/jwtHelper";
import { prisma } from "../../lib/prisma";
import { ILogin } from "./auth.interface";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import ApiError from "../../errors/ApiError";
import status from "http-status";

const login = async (payload: ILogin) => {
  const userData = await prisma.user.findUniqueOrThrow({
    where: {
      status: UserStatus.ACTIVE,
      email: payload.email,
    },
  });

  const isCorrectPassword = await bcrypt.compare(
    payload.password,
    userData.password
  );

  if (!isCorrectPassword) {
    throw new Error("Password incorrect");
  }

  const accessToken = jwtHelpers.generateToken(
    {
      email: userData.email,
      role: userData.role,
    },
    config.jwt.access_token_secret as Secret,
    config.jwt.refress_token_expireIn as string
  );

  const refressToken = jwtHelpers.generateToken(
    {
      email: userData.email,
      role: userData.role,
    },
    config.jwt.refress_token_secret as Secret,
    config.jwt.refress_token_expireIn as string
  );
  return {
    accessToken,
    refressToken,
    needPasswordChange: userData.needPasswordChange,
  };
};

const refressToken = async (token: string) => {
  let decodeData;
  try {
    decodeData = jwtHelpers.verifyToken(
      token,
      config.jwt.refress_token_secret as string
    );
  } catch (error) {
    throw new Error("You are not authorized");
  }

  if (
    typeof decodeData !== "object" ||
    !decodeData ||
    !("email" in decodeData)
  ) {
    throw new Error("Invalid token payload");
  }

  const userData = await prisma.user.findUniqueOrThrow({
    where: {
      email: decodeData?.email as string,
      status: UserStatus.ACTIVE,
    },
  });

  const accessToken = jwtHelpers.generateToken(
    {
      email: userData.email,
      role: userData.role,
    },
    config.jwt.access_token_secret as Secret,
    config.jwt.access_token_expireIn as string
  );

  return {
    accessToken,
    needPasswordChange: userData.needPasswordChange,
  };
};

const changePassword = async (user: any, payload: any) => {
  const userData = await prisma.user.findUniqueOrThrow({
    where: {
      email: user.email,
      status: UserStatus.ACTIVE,
    },
  });

  const isCorrectPassword = await bcrypt.compare(
    payload.oldPassword,
    userData.password
  );

  if (!isCorrectPassword) {
    throw new ApiError(status.UNAUTHORIZED, "Password does not match", "");
  }

  const hashPassword = await bcrypt.hash(payload.newPassword, 10);
  await prisma.user.update({
    where: {
      email: userData.email,
    },
    data: {
      password: hashPassword,
      needPasswordChange: false,
    },
  });
  return {
    message: "Successfully change password",
  };
};

export const AuthServices = {
  login,
  refressToken,
  changePassword,
};
