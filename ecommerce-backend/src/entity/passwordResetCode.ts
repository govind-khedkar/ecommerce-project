import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./User";

@Entity()
export class passwordReset {
    @PrimaryGeneratedColumn()
    id:number;

    @ManyToOne(() => User)
    user:User;

    @Column()
    code:string;

    @Column()
    exprieAt: Date;

}