import { UserRole } from "../../../../generated/prisma/enums";
import { prisma } from "../../lib/prisma";
import bcrypt from "bcrypt";

const createAdmin = async (req: any) => {
  const hashPassword: string = await bcrypt.hash(req.body.password, 12);
  const userData = {
    email: req.body.admin.email,
    password: hashPassword,
    role: UserRole.ADMIN,
  };
  const result = await prisma.$transaction(async (transactionClient) => {
    await transactionClient.user.create({
      data: userData,
    });
    const adminData = await transactionClient.admin.create({
      data: req.body.admin,
    });
    return adminData;
  });
  return result;
};

const createClient = async (req: any) => {
  const hashPassword: string = await bcrypt.hash(req.body.password, 12);
  const userData = {
    email: req.body.client.email,
    password: hashPassword,
    role: UserRole.CLIENT,
  };

  const result = await prisma.$transaction(async (transactionClient) => {
    await transactionClient.user.create({
      data: userData,
    });
    const clinetData = await transactionClient.client.create({
      data: req.body.client,
    });
    return clinetData;
  });
  return result;
};

const getAllUserData = async (params: any, options: any) => {
  const result = await prisma.user.findMany();
  return result;
};

export const UserService = {
  createAdmin,
  createClient,
  getAllUserData,
};
