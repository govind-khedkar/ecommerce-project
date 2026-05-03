import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Type } from "./Type";

@Entity()
export class Category {
    @PrimaryGeneratedColumn()
    id:number;

    @Column()
    name:string;

    @ManyToOne(() => Type)
    type:Type;
}