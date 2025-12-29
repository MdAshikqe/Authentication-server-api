import { Request, Response } from "express";
import { UserService } from "./user.service";
import sendResponse from "../../shared/sendResponse";
import status from "http-status";
import catchAsync from "../../shared/catchAsync";

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

export const UserControllers = {
  createAdmin,
  createClient,
};
