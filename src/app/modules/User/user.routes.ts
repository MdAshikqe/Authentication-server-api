import express, { NextFunction, Request, Response } from "express";
import { UserControllers } from "./user.controller";

const router = express.Router();

router.post(
  "/create-admin",
  UserControllers.createAdmin
  // (req: Request, res: Response, next: NextFunction) => {
  //   req.body = JSON.parse(req.body.data);
  //   return UserControllers.createAdmin(req, res, next);
  // }
);

router.post("/create-client", UserControllers.createClient);

export const UserRoutes = router;
