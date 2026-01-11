import { Prisma } from "../../../../generated/prisma/client";
import { UserRole } from "../../../../generated/prisma/enums";
import { PaginationHelper } from "../../helpers/paginationHelpers";
import { prisma } from "../../lib/prisma";
import bcrypt from "bcrypt";
import { userSearchableFields } from "./user.constant";
import { fileUploaders } from "../../helpers/fileUploader";
import { IAuthUser } from "../../interface/common";
import { Request } from "express";
import { userValidation } from "./user.validation";

const createAdmin = async (req: any) => {
  if (req.file) {
    const uploadResult = await fileUploaders.uploadToCloudinary(req.file);
    req.body.admin.profilePhoto = uploadResult?.secure_url;
  }

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
  if (req.file) {
    const uploadResult = await fileUploaders.uploadToCloudinary(req.file);
    req.body.client.profilePhoto = uploadResult?.secure_url;
  }
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
  const { page, limit, skip, sortBy, sortOrder } =
    PaginationHelper.calculatePagination(options);
  const { searchTerm, ...filterData } = params;

  const andCondition: Prisma.UserWhereInput[] = [];

  if (params.searchTerm) {
    andCondition.push({
      OR: userSearchableFields.map((field) => ({
        [field]: {
          contains: params.searchTerm,
          mode: "insensitive",
        },
      })),
    });
  }

  if (Object.keys(filterData).length > 0) {
    andCondition.push({
      AND: Object.keys(filterData).map((key) => ({
        [key]: {
          equals: (filterData as any)[key],
        },
      })),
    });
  }

  const whereCondition: Prisma.UserWhereInput = { AND: andCondition };

  const result = await prisma.user.findMany({
    where: whereCondition,
    skip,
    take: limit,
    orderBy:
      options.sortBy && options.sortOrder
        ? {
            [options.sortBy]: options.sortOrder,
          }
        : { createdAt: "desc" },
    select: {
      id: true,
      email: true,
      needPasswordChange: true,
      role: true,
      status: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  const total = await prisma.user.count({
    where: whereCondition,
  });

  return {
    metaData: {
      page,
      limit,
      total,
    },
    data: result,
  };
};

const updateStatusUser = async (id: any, payload: string) => {
  await prisma.user.findUniqueOrThrow({
    where: {
      id: id,
    },
  });

  const updateUserStatus = await prisma.user.update({
    where: {
      id: id,
    },
    data: payload,
  });
  return updateUserStatus;
};

const getMyProfile = async (user: IAuthUser) => {
  const userInfo = await prisma.user.findUniqueOrThrow({
    where: {
      email: user?.email as string,
    },
    select: {
      id: true,
      email: true,
      role: true,
      needPasswordChange: true,
      status: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  let profileInfo;

  if (userInfo.role === UserRole.ADMIN) {
    profileInfo = await prisma.admin.findUniqueOrThrow({
      where: {
        email: userInfo.email,
      },
    });
  }

  if (userInfo.role === UserRole.CLIENT) {
    profileInfo = await prisma.client.findUniqueOrThrow({
      where: {
        email: userInfo.email,
      },
    });
  } else if (userInfo.role === UserRole.SUPER_ADMIN) {
    profileInfo = await prisma.admin.findUniqueOrThrow({
      where: {
        email: userInfo.email,
      },
    });
  }

  return {
    ...userInfo,
    ...profileInfo,
  };
};

const updateMyProfile = async (user: IAuthUser, req: Request) => {
  const userInfo = await prisma.user.findUniqueOrThrow({
    where: {
      email: user?.email as string,
    },
  });

  if (req.file) {
    const uploadResult = await fileUploaders.uploadToCloudinary(req.file);
    req.body.profilePhoto = uploadResult?.secure_url;
  }

  let profileInfo;

  if (userInfo.role === UserRole.ADMIN) {
    profileInfo = await prisma.admin.update({
      where: {
        email: userInfo.email,
      },
      data: req.body,
    });
  } else if (userInfo.role === UserRole.CLIENT) {
    profileInfo = await prisma.client.update({
      where: {
        email: userInfo.email,
      },
      data: req.body,
    });
  } else if (userInfo.role === UserRole.SUPER_ADMIN) {
    profileInfo = await prisma.admin.update({
      where: {
        email: userInfo.email,
      },
      data: req.body,
    });
  }
  return {
    ...profileInfo,
  };
};
export const UserService = {
  createAdmin,
  createClient,
  getAllUserData,
  updateStatusUser,
  getMyProfile,
  updateMyProfile,
};
