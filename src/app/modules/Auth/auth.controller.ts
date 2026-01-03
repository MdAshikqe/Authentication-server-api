import { Request, Response } from "express";
import catchAsync from "../../shared/catchAsync";
import { AuthServices } from "./auth.service";
import sendResponse from "../../shared/sendResponse";
import status from "http-status";

const login = catchAsync(async (req: Request, res: Response) => {
  const result = await AuthServices.login(req.body);

  const { refressToken } = result;
  res.cookie("refressToken", refressToken, {
    secure: false,
    httpOnly: true,
  });

  sendResponse(res, {
    sucess: true,
    statuscode: status.OK,
    message: "login successfully",
    data: {
      accessToken: result.accessToken,
      needPasswordChange: result.needPasswordChange,
    },
  });
});

const refressToken = catchAsync(async (req: Request, res: Response) => {
  const { refressToken } = req.cookies;
  const result = await AuthServices.refressToken(refressToken);

  sendResponse(res, {
    sucess: true,
    statuscode: status.OK,
    message: "Refress Token Genearate Successfully",
    data: {
      accessToken: result.accessToken,
      needPasswordChange: result.needPasswordChange,
    },
  });
});

const changePassword = catchAsync(
  async (req: Request & { user?: any }, res: Response) => {
    const userData = req.user;
    const result = await AuthServices.changePassword(userData, req.body);

    sendResponse(res, {
      sucess: true,
      statuscode: status.OK,
      message: "Password change successfully",
      data: result,
    });
  }
);

const forgotPassword = catchAsync(async (req: Request, res: Response) => {
  const result = await AuthServices.forgotPassword(req.body);

  sendResponse(res, {
    statuscode: status.OK,
    sucess: true,
    message: "Check your email",
    data: result,
  });
});

export const AuthControllers = {
  login,
  refressToken,
  changePassword,
  forgotPassword,
};
