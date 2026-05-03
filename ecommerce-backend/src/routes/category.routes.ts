import { Router } from "express";
import { adminOnly, authMiddleware } from "../middleware/auth.middleware";
import { addCategory, getByType, getCategories } from "../controllers/category.controllers";

const categoryRouter = Router();

categoryRouter.post("/", authMiddleware, adminOnly, addCategory);
categoryRouter.get("/", getCategories);
categoryRouter.get("/by-type/:typeId", getByType);

export default categoryRouter;