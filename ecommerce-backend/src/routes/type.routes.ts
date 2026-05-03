import { Router } from "express";
import { adminOnly, authMiddleware } from "../middleware/auth.middleware";
import { addType, getTypes } from "../controllers/type.controllers";

const typeRouter = Router();

typeRouter.post("/", authMiddleware, adminOnly, addType);
typeRouter.get("/", getTypes);


export default typeRouter;