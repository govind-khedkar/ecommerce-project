import { Router } from "express";
import { adminOnly, authMiddleware } from "../middleware/auth.middleware";
import { adddSubCategory, getByCategory, getSubcategories } from "../controllers/subCategory.controllers";
import { getBySubCategory } from "../controllers/product.controllers";

const subCategoryRouter = Router()
subCategoryRouter.post("/", authMiddleware, adminOnly, adddSubCategory);
subCategoryRouter.get("/subcategories", getSubcategories);
subCategoryRouter.get("/by-category/:categoryId", getByCategory);

export default subCategoryRouter;