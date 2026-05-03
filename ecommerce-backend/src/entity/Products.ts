import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { SubCategory } from "./SubCategory";

@Entity()
export class Product {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name:string;

    @Column()
    description: string;

    @Column("decimal", {precision: 10, scale:2})
    price:number;

    @Column()
    stock:number

    @Column({nullable:true})
    imagePath: string;

    @ManyToOne(() => SubCategory)
    subCategory:SubCategory;

    @CreateDateColumn()
    createdAt: Date;

}