import express from "express";
import cors from "cors";
import path from "path";
import { AppDataSource } from "./data-source";
import userRoutes from "./routes/user.routes";
import authRouter from "./routes/auth.routes";
import cookieParser from "cookie-parser";
import productRouter from "./routes/product.routes";
import typeRouter from "./routes/type.routes";
import categoryRouter from "./routes/category.routes";
import cartRouter from "./routes/cart.routes";
import orderRouter from "./routes/order.routes";
import subCategoryRouter from "./routes/subCategory.routes";

const app = express();

app.use(cors({
    origin: ['http://localhost:4200', 'http://localhost:3000'],
    credentials: true
}));

app.use(express.json());
app.use(cookieParser());

app.use("/users", userRoutes);
app.use("/auth", authRouter);
app.use("/products", productRouter);
app.use("/types", typeRouter);
app.use("/categories", categoryRouter);
app.use("/subCategories", subCategoryRouter);
app.use("/cart", cartRouter);
app.use("/order", orderRouter);
app.use("/images", express.static(path.join(__dirname, "../ProductImages")));

app.use(express.static(path.join(__dirname, "../public")));

app.get("/{*path}", (req, res) => {
    res.sendFile(path.join(__dirname, "../public/index.html"));
});

AppDataSource.initialize().then(async () => {
    console.log("DB connected");
    app.listen(3000, () => {
        console.log("Server running on http://localhost:3000");
    });
}).catch((error) => {
    console.error("DB connection error: ", error);
});