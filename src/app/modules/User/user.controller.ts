import { Request, Response } from "express";
import { UserService } from "./user.service";

const createAdmin = async (req: Request, res: Response) => {
  const result = await UserService.createAdmin();
  res.status(200).json({
    sucess: true,
    message: "Admin create successfully",
    data: result,
  });
};

export const UserControllers = {
  createAdmin,
};
