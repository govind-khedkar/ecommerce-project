import { DataSource } from "typeorm";
import "reflect-metadata";
import { User } from "./entity/User";
import {  passwordReset } from "./entity/passwordResetCode";
import { Product } from "./entity/Products";
import { Category } from "./entity/Category";
import { SubCategory } from "./entity/SubCategory";
import { Type } from "./entity/Type";
import { Cart } from "./entity/Cart";
import { CartItem } from "./entity/CartItem";
import { Order } from "./entity/Order";
import { OrderItem } from "./entity/OrderItem";


export const AppDataSource = new DataSource({
    type:"better-sqlite3",
    database:"./mydatabase.db",
    synchronize:true,
    logging:true,
    entities:[User, passwordReset, Product, Category, SubCategory, Type, Cart, CartItem, Order, OrderItem],
    migrations:["src/migrations/*.ts"],
});