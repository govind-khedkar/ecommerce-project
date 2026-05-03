import { Router } from "express";
import { forgotPassword, login, logout, register, resetPassword, verifyCode } from "../controllers/auth.controllers";
import { authMiddleware } from "../middleware/auth.middleware";

const authRouter = Router();

authRouter.post("/register", register);
authRouter.post("/login", login)
authRouter.post("/forgot-password", forgotPassword);
authRouter.post("/verify-password", verifyCode);
authRouter.post("/reset-password", resetPassword);
authRouter.post("/logout",authMiddleware, logout);
export default authRouter;
