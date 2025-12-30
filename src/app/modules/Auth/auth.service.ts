import { Secret } from "jsonwebtoken";
import { UserStatus } from "../../../../generated/prisma/enums";
import config from "../../config";
import { jwtHelpers } from "../../helpers/jwtHelper";
import { prisma } from "../../lib/prisma";
import { ILogin } from "./auth.interface";
import bcrypt from "bcrypt";

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

export const AuthServices = {
  login,
};
