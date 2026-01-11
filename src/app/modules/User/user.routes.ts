import express, { NextFunction, Request, Response } from "express";
import { UserControllers } from "./user.controller";
import { userValidation } from "./user.validation";
import validateRequest from "../../middleware/validateRequest";
import { fileUploaders } from "../../helpers/fileUploader";
import auth from "../../middleware/auth";
import { UserRole } from "../../../../generated/prisma/enums";

const router = express.Router();

router.post(
  "/create-admin",
  fileUploaders.upload.single("file"),
  (req: Request, res: Response, next: NextFunction) => {
    req.body = userValidation.createAdminValidationSchema.parse(
      JSON.parse(req.body.data)
    );
    return UserControllers.createAdmin(req, res, next);
  }
);

router.post(
  "/create-client",
  fileUploaders.upload.single("file"),
  (req: Request, res: Response, next: NextFunction) => {
    req.body = userValidation.createClinetValidationSchema.parse(
      JSON.parse(req.body.data)
    );
    return UserControllers.createClient(req, res, next);
  }
);
router.get("/", UserControllers.getAllUserData);
router.patch("/:id", UserControllers.updateStatusUser);
router.get(
  "/get-my-profile",
  auth(UserRole.ADMIN, UserRole.CLIENT, UserRole.SUPER_ADMIN),
  UserControllers.getMyProfile
);

export const UserRoutes = router;
