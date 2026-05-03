import { Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./User";
import { CartItem } from "./CartItem";

@Entity()
export class Cart {
    @PrimaryGeneratedColumn()
    id:number;

    @OneToOne(() => User)
    @JoinColumn()
    user: User;

    @OneToMany(() => CartItem, (cartItem) => 
    cartItem.cart)
    cartItems: CartItem[];
}

