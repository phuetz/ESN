import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
} from 'typeorm';

export enum UserRole {
  ADMIN = 'admin',
  MANAGER = 'manager',
  CONSULTANT = 'consultant',
  CLIENT = 'client',
}

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ unique: true })
  email!: string;

  @Column()
  password!: string;

  @Column()
  firstName!: string;

  @Column()
  lastName!: string;

  @Column({
    type: 'text',
    enum: UserRole,
    default: UserRole.CONSULTANT,
  })
  role!: UserRole;

  @Column({ default: true })
  isActive!: boolean;

  @Column({ nullable: true })
  lastLoginAt?: Date;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @DeleteDateColumn()
  deletedAt?: Date;

  // Virtual field - don't include password in JSON responses
  toJSON() {
    const { password, ...user } = this;
    return user;
  }
}
