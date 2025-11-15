import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { Consultant } from './Consultant';
import { Project } from './Project';
import { Client } from './Client';
import { Timesheet } from './Timesheet';

export enum MissionStatus {
  PLANNED = 'planned',
  ACTIVE = 'active',
  ENDING_SOON = 'ending_soon',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
}

/**
 * Mission entity - Consultant assignments
 * Detailed tracking of consultant missions within projects
 */
@Entity('missions')
export class Mission {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  title!: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column({
    type: 'text',
    enum: MissionStatus,
    default: MissionStatus.PLANNED,
  })
  status!: MissionStatus;

  @Column({ type: 'date' })
  startDate!: Date;

  @Column({ type: 'date', nullable: true })
  endDate?: Date;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  dailyRate!: number; // Consultant daily rate for this mission

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  clientRate?: number; // Rate charged to client

  @Column({ type: 'decimal', precision: 5, scale: 2, default: 100 })
  allocatedPercentage!: number; // % of consultant time (0-100)

  @Column({ nullable: true })
  location?: string;

  @Column({ type: 'boolean', default: false })
  isRemote!: boolean;

  @Column({ type: 'simple-json', nullable: true })
  requiredSkills?: string[];

  @Column({ type: 'text', nullable: true })
  objectives?: string; // Mission objectives

  @Column({ type: 'text', nullable: true })
  deliverables?: string;

  @Column({ type: 'int', default: 0 })
  alertDaysBefore!: number; // Alert X days before end

  @Column({ type: 'boolean', default: false })
  renewalRequested!: boolean;

  @Column({ type: 'text', nullable: true })
  notes?: string;

  // Relations
  @ManyToOne(() => Consultant, { nullable: false })
  @JoinColumn({ name: 'consultantId' })
  consultant!: Consultant;

  @Column()
  consultantId!: number;

  @ManyToOne(() => Project, { nullable: false })
  @JoinColumn({ name: 'projectId' })
  project!: Project;

  @Column()
  projectId!: number;

  @ManyToOne(() => Client, { nullable: false })
  @JoinColumn({ name: 'clientId' })
  client!: Client;

  @Column()
  clientId!: number;

  @OneToMany(() => Timesheet, (timesheet) => timesheet.mission)
  timesheets?: Timesheet[];

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @DeleteDateColumn()
  deletedAt?: Date;
}
