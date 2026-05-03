import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Cart } from "./Cart";
import { Product } from "./Products";

@Entity()
export class CartItem {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    quantity : number;

    @ManyToOne(() => Cart)
    cart:Cart;

    @ManyToOne(() => Product)
    product:Product;
}

