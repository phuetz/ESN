import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Client } from './Client';
import { Consultant } from './Consultant';

export enum ProjectStatus {
  PLANNED = 'planned',
  IN_PROGRESS = 'in_progress',
  ON_HOLD = 'on_hold',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
}

@Entity('projects')
export class Project {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name!: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column({
    type: 'text',
    enum: ProjectStatus,
    default: ProjectStatus.PLANNED,
  })
  status!: ProjectStatus;

  @Column({ type: 'date' })
  startDate!: Date;

  @Column({ type: 'date', nullable: true })
  endDate?: Date;

  @Column({ type: 'decimal', precision: 12, scale: 2, nullable: true })
  budget?: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  dailyRate?: number;

  @Column({ type: 'simple-json', nullable: true })
  technologies?: string[];

  @Column({ type: 'text', nullable: true })
  location?: string;

  @Column({ type: 'boolean', default: false })
  isRemote!: boolean;

  @Column({ type: 'text', nullable: true })
  notes?: string;

  // Relations
  @ManyToOne(() => Client, (client) => client.projects, { nullable: false })
  @JoinColumn({ name: 'clientId' })
  client!: Client;

  @Column()
  clientId!: number;

  @ManyToOne(() => Consultant, (consultant) => consultant.projects, {
    nullable: true,
  })
  @JoinColumn({ name: 'consultantId' })
  consultant?: Consultant;

  @Column({ nullable: true })
  consultantId?: number;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @DeleteDateColumn()
  deletedAt?: Date;
}
