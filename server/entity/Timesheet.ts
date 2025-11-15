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
import { Consultant } from './Consultant';
import { Mission } from './Mission';
import { User } from './User';

export enum TimesheetStatus {
  DRAFT = 'draft',
  SUBMITTED = 'submitted',
  APPROVED = 'approved',
  REJECTED = 'rejected',
  INVOICED = 'invoiced',
}

/**
 * Timesheet entity - Time tracking and billing
 * Track consultant time for billing and reporting
 */
@Entity('timesheets')
export class Timesheet {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'date' })
  date!: Date;

  @Column({ type: 'decimal', precision: 5, scale: 2 })
  hours!: number;

  @Column({ type: 'text', nullable: true })
  description?: string; // Work description

  @Column({
    type: 'text',
    enum: TimesheetStatus,
    default: TimesheetStatus.DRAFT,
  })
  status!: TimesheetStatus;

  @Column({ type: 'boolean', default: true })
  isBillable!: boolean;

  @Column({ type: 'boolean', default: false })
  isOvertime!: boolean;

  @Column({ type: 'text', nullable: true })
  rejectionReason?: string;

  @Column({ type: 'timestamp', nullable: true })
  submittedAt?: Date;

  @Column({ type: 'timestamp', nullable: true })
  approvedAt?: Date;

  @Column({ type: 'timestamp', nullable: true })
  invoicedAt?: Date;

  @Column({ nullable: true })
  invoiceId?: number; // Reference to invoice if invoiced

  // Relations
  @ManyToOne(() => Consultant, { nullable: false })
  @JoinColumn({ name: 'consultantId' })
  consultant!: Consultant;

  @Column()
  consultantId!: number;

  @ManyToOne(() => Mission, { nullable: false })
  @JoinColumn({ name: 'missionId' })
  mission!: Mission;

  @Column()
  missionId!: number;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'approvedById' })
  approvedBy?: User;

  @Column({ nullable: true })
  approvedById?: number;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @DeleteDateColumn()
  deletedAt?: Date;
}
