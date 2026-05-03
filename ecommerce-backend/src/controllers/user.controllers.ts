import { AppDataSource } from "../data-source";
import bcrypt from "bcrypt";
import { User } from "../entity/User";

const userRepo = AppDataSource.getRepository(User);
export const getAllUsers = async (req: any, res: any) => {
    const userRepo = AppDataSource.getRepository(User);

    const users = await userRepo.find();
    const saftUsers = users.map((u: any) => ({
        id: u.id,
        name: u.name,
        email: u.email,
        role: u.role,
        isLocked: u.isLocked
    }));

    res.status(200).json({
        message: "Users fetched",
        data: saftUsers
    });
}

export const toggleUserLock = async (req: any, res: any) => {
    const userId = Number(req.params.id);
    const { isLocked } = req.body;

    if (typeof isLocked !== "boolean") {
        return res.status(400).json({ message: "isLocked must be true or false" });
    }

    if (isNaN(userId)) return res.status(400).json({ message: "Invalid user id" });

    const user = await userRepo.findOne({ where: { id: userId } });

    if (!user) return res.status(404).json({ message: "User not found" });

    if (user.role == "ADMIN") return res.status(403).json({ message: "Cannot lock admin" });

    user.isLocked = isLocked;
    await userRepo.save(user);

    return res.status(200).json({ message: isLocked ? "User locked" : "User unlocked" });
};


export const getProfile = async (req: any, res: any) => {
    const userId = req.user.userId;
    const user = await userRepo.findOne({ where: { id: userId } });

    if (!user) return res.status(404).json({ message: "User not found" });

    return res.status(200).json({
        data: {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role
        }
    });
}

export const updateProfile = async (req: any, res: any) => {
    const userId = req.user.userId;
    const { name, email } = req.body;

    if (!name || !email) {
        return res.status(400).json({ message: "Missing fields" });
    }

    const user = await userRepo.findOne({ where: { id: userId } });
    if (!user) return res.status(404).json({ message: "User not found" });

    const existingUser = await userRepo.findOne({ where: { email } });
    if (existingUser && existingUser.id !== userId) {
        return res.status(400).json({ message: "Email already in use" });
    }

    user.name = name;
    user.email = email;
    await userRepo.save(user);

    return res.status(200).json({ message: "Profile updated successfully" });
}

export const changePassword = async (req: any, res: any) => {
    const userId = req.user.userId;
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
        return res.status(400).json({ message: "Missing fields" });
    }

    const user = await userRepo.findOne({ where: { id: userId } });
    if (!user) return res.status(404).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(currentPassword, user.passwordHash);
    if (!isMatch) {
        return res.status(400).json({ message: "Current password is incorrect" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.passwordHash = hashedPassword;
    await userRepo.save(user);

    return res.status(200).json({ message: "Password changed successfully" });
}