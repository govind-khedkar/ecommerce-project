import { Router } from "express";
import { adminOnly, authMiddleware } from "../middleware/auth.middleware";
import { addProduct, deleteProduct, filterByPrice, filteredProducts, getBySubCategory, getProductById, searchProducts, updateProduct } from "../controllers/product.controllers";
import { upload } from "../middleware/upload.middleware";

const productRouter = Router();

productRouter.post("/",authMiddleware, adminOnly, upload.single("image"), addProduct);
productRouter.get("/", filteredProducts)
productRouter.get("/search", searchProducts);
productRouter.get("/filter", filterByPrice);
productRouter.get("/subcategory/:id", getBySubCategory);
productRouter.get("/:id", getProductById);
productRouter.put("/:id", authMiddleware, adminOnly, upload.single("image"), updateProduct);
productRouter.delete("/:id", authMiddleware, adminOnly, deleteProduct);


export default productRouter;
