import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  Index,
} from 'typeorm';

export enum UserRole {
  ADMIN = 'admin',
  MANAGER = 'manager',
  CONSULTANT = 'consultant',
  CLIENT = 'client',
}

@Entity('users')
@Index(['email', 'isActive']) // Composite index for login queries
export class User {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ unique: true })
  @Index() // Single index for email lookups
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
  @Index()
  role!: UserRole;

  @Column({ default: true })
  @Index()
  isActive!: boolean;

  @Column({ nullable: true })
  lastLoginAt?: Date;

  @Column({ nullable: true, type: 'text' })
  refreshToken?: string;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @DeleteDateColumn()
  deletedAt?: Date;

  // Virtual field - don't include password and refreshToken in JSON responses
  toJSON() {
    const { password, refreshToken, ...user } = this;
    return user;
  }
}
