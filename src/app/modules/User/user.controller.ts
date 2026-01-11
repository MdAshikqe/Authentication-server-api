import { Request, Response } from "express";
import { UserService } from "./user.service";
import sendResponse from "../../shared/sendResponse";
import status from "http-status";
import catchAsync from "../../shared/catchAsync";
import pick from "../../shared/pick";
import {
  userFilterAbleFields,
  userPaginationFieldsOptions,
} from "./user.constant";

// const createAdmin = async (req: Request, res: Response) => {
//   const result = await UserService.createAdmin();

//   sendResponse(res, {
//     sucess: true,
//     statuscode: status.OK,
//     message: "User create sucessfully",
//     data: result,
//   });
// };

const createAdmin = catchAsync(async (req: Request, res: Response) => {
  const result = await UserService.createAdmin(req);

  sendResponse(res, {
    sucess: true,
    statuscode: status.OK,
    message: "Admin create sucessfully",
    data: result,
  });
});

const createClient = catchAsync(async (req: Request, res: Response) => {
  const result = await UserService.createClient(req);

  sendResponse(res, {
    sucess: true,
    statuscode: status.OK,
    message: "Cleint create successfully",
    data: result,
  });
});

const getAllUserData = catchAsync(async (req: Request, res: Response) => {
  const filter = pick(req.query, userFilterAbleFields);
  const options = pick(req.query, userPaginationFieldsOptions);
  const result = await UserService.getAllUserData(filter, options);

  sendResponse(res, {
    sucess: true,
    statuscode: status.OK,
    message: "User data successfully retrive",
    metaData: result.metaData,
    data: result.data,
  });
});

const updateStatusUser = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await UserService.updateStatusUser(id, req.body);

  sendResponse(res, {
    sucess: true,
    statuscode: status.OK,
    message: "User status change successfully",
    data: result,
  });
});

const getMyProfile = catchAsync(async (req: Request, res: Response) => {
  const result = await UserService.getMyProfile();

  sendResponse(res, {
    statuscode: status.OK,
    sucess: true,
    message: "Successfully get my profile",
    data: result,
  });
});

export const UserControllers = {
  createAdmin,
  createClient,
  getAllUserData,
  updateStatusUser,
  getMyProfile,
};
