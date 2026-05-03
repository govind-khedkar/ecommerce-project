import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column({ unique: true })
    email: string;

    @Column()
    passwordHash: string;

    @Column()
    role: string;

    @Column({default:false})
    isLocked: boolean;

    @Column({default: () => "CURRENT_TIMESTAMP"})
    createdAt: Date;

}