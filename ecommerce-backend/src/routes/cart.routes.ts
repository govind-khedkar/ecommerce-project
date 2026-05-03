import { Router } from "express";
import { authMiddleware } from "../middleware/auth.middleware";
import { addToCart, getCart, removeItem, updateCartItem } from "../controllers/cart.controllers";

const cartRouter = Router();

cartRouter.post("/add", authMiddleware, addToCart);
cartRouter.get("/", authMiddleware, getCart);
cartRouter.put("/update", authMiddleware, updateCartItem);
cartRouter.delete("/remove",authMiddleware, removeItem);


export default cartRouter;