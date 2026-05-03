import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Category } from "./Category";

@Entity()
export class SubCategory {
    @PrimaryGeneratedColumn()
    id:number;

    @Column()
    name:number;

    @ManyToOne(() => Category)
    category:Category;

}