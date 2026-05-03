import { AppDataSource } from "../data-source";
import { User } from "../entity/User";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import "dotenv/config";
import { passwordReset } from "../entity/passwordResetCode";
import { sessions } from "../session";

const userRepo = AppDataSource.getRepository(User)
const resetRepo = AppDataSource.getRepository(passwordReset);


export const register = async (req: any, res: any) => {
    const { name, email, password} = req.body;

    if (!name || !email || !password) {
        return res.status(400).json({ message: "Missing fields" });
    }

    const existingUser = await userRepo.findOne({ where: { email } });

    if (existingUser) {
        return res.status(401).json({ message: "User already exits" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = userRepo.create({
        name,
        email,
        passwordHash: hashedPassword,
        role : "CUSTOMER"
    })

    await userRepo.save(user);

    res.status(201).json({ message: "User registered successfully" })
}

export const login = async (req: any, res: any) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: "Missing fields" });
    }

    const user = await userRepo.findOne({ where: { email } });

    if (!user) {
        return res.status(401).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);

    if (!isMatch) {
        return res.status(401).json({ message: "Invalid credentials" });
    }

    if (user.isLocked) {
        return res.status(403).json({ message: "Account is locked" });
    }

    const token = jwt.sign(
        { userId: user.id, role: user.role },
        process.env.JWT_SECRET as string,
        { expiresIn: "1d" }
    );

    sessions.set(token, {
        userId: user.id,
        role: user.role
    });

    res.cookie("token", token, {
        httpOnly: true
    });

    return res.status(200).json({
        message: "Login successful",
        user: {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role
        }
    });
};


export const forgotPassword = async (req: any, res: any) => {
    const { email } = req.body;

    if (!email) {
        return res.status(400).json({ message: "Missing fields" });
    }
    const user = await userRepo.findOne({ where: { email } });
    if (!user) {
        return res.status(401).json({ message: "User not exit" });
    }

    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const reset = resetRepo.create({
        user: user,
        code: code,
        exprieAt: new Date(Date.now() + 10 * 60 * 1000)
    });
    resetRepo.save(reset);
    res.status(200).json({
        message: "Reset code generated",
        data: { code }
    });
}

export const verifyCode = async (req: any, res: any) => {
    const { email, code } = req.body;

    if (!email || !code) {
        return res.status(400).json({ message: "Missing fields" });
    }
    const user = await userRepo.findOne({ where: { email } });
    if (!user) {
        return res.status(401).json({ message: "User not exit" });
    }

    const resetCodeUser = await resetRepo.findOne({ where: { user: { id: user.id }, code }, relations: ["user"] });

    if (!resetCodeUser) {
        return res.status(401).json({ message: "Invalid code" });
    }

    if (resetCodeUser.exprieAt < new Date()) {
        return res.status(400).json({ message: "Code expired" });
    }

    return res.status(200).json({ message: "Code verify successfully" });
}

export const resetPassword = async (req: any, res: any) => {
    const { email, code, newPassword } = req.body;

    
    if (!email || !code || !newPassword) {
        return res.status(400).json({ message: "Missing fields" });
    }
    
    const user = await userRepo.findOne({ where: { email } });
    if (!user) {
        return res.status(401).json({ message: "User not exit" });
    }

    const resetCodeUser = await resetRepo.findOne({ where: { user: { id: user.id }, code }, relations: ["user"] });

    if (!resetCodeUser) {
        return res.status(401).json({ message: "Invalid code" });
    }

    if (resetCodeUser.exprieAt < new Date()) {
        return res.status(400).json({ message: "Code expired" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    user.passwordHash = hashedPassword;

    await userRepo.save(user);
    await resetRepo.remove(resetCodeUser);

    return res.status(200).json({ message: "Password reset successfully" });
}

export const logout = async (req: any, res: any) => {
    const token = req.cookie?.token;

    sessions.delete(token);

    res.clearCookie("token");

    return res.status(200).json({ message: "Logged out" });
}
