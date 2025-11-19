import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  OneToMany,
  OneToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { Project } from './Project';
import { User } from './User';

export enum ConsultantStatus {
  ACTIVE = 'active',
  BENCH = 'bench',
  INACTIVE = 'inactive',
}

@Entity('consultants')
export class Consultant {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  firstName!: string;

  @Column()
  lastName!: string;

  @Column({ nullable: true })
  @Index()
  email?: string;

  @Column({ nullable: true })
  phone?: string;

  @Column()
  @Index()
  role!: string;

  @Column({
    type: 'text',
    enum: ConsultantStatus,
    default: ConsultantStatus.ACTIVE,
  })
  @Index()
  status!: ConsultantStatus;

  @Column({ type: 'int', default: 0 })
  experience!: number;

  @Column({ type: 'simple-json', nullable: true })
  skills?: string[];

  @Column({ type: 'text', nullable: true })
  bio?: string;

  @Column({ nullable: true })
  linkedin?: string;

  @Column({ nullable: true })
  github?: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  dailyRate?: number;

  @Column({ nullable: true })
  availability?: Date;

  @Column({ nullable: true })
  address?: string;

  @Column({ nullable: true })
  city?: string;

  @Column({ nullable: true })
  postalCode?: string;

  @Column({ nullable: true })
  country?: string;

  @Column({ type: 'text', nullable: true })
  notes?: string;

  // Relations
  @OneToMany(() => Project, (project) => project.consultant)
  projects?: Project[];

  @OneToOne(() => User, { nullable: true })
  @JoinColumn()
  user?: User;

  @Column({ nullable: true })
  userId?: number;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @DeleteDateColumn()
  deletedAt?: Date;
}
