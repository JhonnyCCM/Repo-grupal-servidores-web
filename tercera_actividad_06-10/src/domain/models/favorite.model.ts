import { Column, Entity, PrimaryGeneratedColumn, CreateDateColumn, ManyToOne, JoinColumn } from "typeorm";
import { User } from "./user.model";

@Entity("favorite")
export class Favorite {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column()
  userId!: string;

  @ManyToOne(() => User, (user) => user.favorites)
  @JoinColumn({ name: "userId" })
  user!: User;
  
  @Column()
  entityType!: "machine" | "gymClass" | "coach";

  @Column()
  entityId!: string;

  @CreateDateColumn()
  createdAt!: Date;
}