import { NextFunction, Response } from "express";
import jwt from "jsonwebtoken";
import { sessions } from "../session";
import { AppDataSource } from "../data-source";
import { User } from "../entity/User";

const userRepo = AppDataSource.getRepository(User);

export const authMiddleware = async (req: any, res: Response, next: NextFunction) => {

    const token = req.cookies?.token;

    if (!token) {
        return res.status(401).json({ message: "No token" });
    }

    try {
        const decoded: any = jwt.verify(token, process.env.JWT_SECRET as string);
        const session = sessions.get(token);

        if (!session) {
            return res.status(401).json({ message: "Session expired" });
        }

        const user = await userRepo.findOne({ where: { id: decoded.userId } });

        if (!user) {
            return res.status(401).json({ message: "User not found" });
        }

        if (user.isLocked) {
            sessions.delete(token);
            res.clearCookie("token");
            return res.status(403).json({ message: "Account is locked" });
        }

        req.user = decoded;

        next();

    } catch (err) {
        return res.status(401).json({ message: "Invalid token" });
    }
};

export const adminOnly = (req: any, res: any, next: any) => {
    if (req.user.role !== "ADMIN") {
        return res.status(403).json({ message: "Forbidden" });
    }
    next();
}
