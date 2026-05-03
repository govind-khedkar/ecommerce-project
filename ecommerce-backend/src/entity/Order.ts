import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./User";

@Entity()
export class Order {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => User)
    user: User;

    @Column("decimal", { precision: 10, scale: 2 })
    totalAmount: number;

    @Column({default: "PENDING"})
    status: string;

    @Column()
    PaymentMethod: string;

    @CreateDateColumn()
    createdAt: Date;

}