import express from "express";
import { AuthControllers } from "./auth.controller";

const router = express.Router();

router.post("/login", AuthControllers.login);
router.post("/refress-token", AuthControllers.refressToken);

export const AuthRoutes = router;
