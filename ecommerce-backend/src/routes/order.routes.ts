import { Router } from "express";
import { adminOnly, authMiddleware } from "../middleware/auth.middleware";
import { checkout, getAllOrders, getOrderDetails, getOrders, updateOrderStatus } from "../controllers/order.controllers";

const orderRouter = Router();
orderRouter.get("/all", authMiddleware, adminOnly, getAllOrders);
orderRouter.post("/checkout", authMiddleware, checkout);
orderRouter.get("/", authMiddleware, getOrders);
orderRouter.get("/:id", authMiddleware, getOrderDetails);
orderRouter.put("/:id/status", authMiddleware, adminOnly, updateOrderStatus);

export default orderRouter;