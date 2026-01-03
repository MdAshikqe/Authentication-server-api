import express from "express";
import { AuthControllers } from "./auth.controller";
import auth from "../../middleware/auth";
import { UserRole } from "../../../../generated/prisma/enums";

const router = express.Router();

router.post("/login", AuthControllers.login);
router.post("/refress-token", AuthControllers.refressToken);
router.post(
  "/change-password",
  auth(UserRole.ADMIN, UserRole.CLIENT, UserRole.SUPER_ADMIN),
  AuthControllers.changePassword
);

router.post("/forgot-password", AuthControllers.forgotPassword);
router.post("/reset-password", AuthControllers.resetPassword);

export const AuthRoutes = router;
