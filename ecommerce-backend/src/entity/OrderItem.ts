import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Order } from "./Order";
import { Product } from "./Products";

@Entity()
export class OrderItem {
    @PrimaryGeneratedColumn()
    id:number;

    @ManyToOne(() => Order)
    order:Order;

    @ManyToOne(() => Product)
    product: Product;

    @Column()
    quantity:number;

    @Column()
    priceAtTime:number;
}