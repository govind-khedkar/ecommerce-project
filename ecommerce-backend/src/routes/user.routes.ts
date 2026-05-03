import { Router } from "express";
import { changePassword, getAllUsers, getProfile, toggleUserLock, updateProfile } from "../controllers/user.controllers";
import { adminOnly, authMiddleware } from "../middleware/auth.middleware";

const userRoutes = Router();
userRoutes.get("/all",authMiddleware,adminOnly, getAllUsers);
userRoutes.put("/:id/lock", authMiddleware, adminOnly, toggleUserLock);
userRoutes.get("/profile", authMiddleware, getProfile);
userRoutes.put("/profile", authMiddleware, updateProfile);
userRoutes.put("/change-password", authMiddleware, changePassword);

export default userRoutes;
