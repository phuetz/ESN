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
import { User } from './User';
import { Consultant } from './Consultant';

export enum LeaveType {
  VACATION = 'vacation',
  SICK = 'sick',
  RTT = 'rtt',
  UNPAID = 'unpaid',
  PARENTAL = 'parental',
  COMPASSIONATE = 'compassionate',
  OTHER = 'other',
}

export enum LeaveStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
  CANCELLED = 'cancelled',
}

/**
 * Leave entity - Leave and absence management
 * Track vacation, sick leave, and other absences
 */
@Entity('leaves')
export class Leave {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({
    type: 'text',
    enum: LeaveType,
  })
  type!: LeaveType;

  @Column({
    type: 'text',
    enum: LeaveStatus,
    default: LeaveStatus.PENDING,
  })
  status!: LeaveStatus;

  @Column({ type: 'date' })
  startDate!: Date;

  @Column({ type: 'date' })
  endDate!: Date;

  @Column({ type: 'decimal', precision: 5, scale: 2 })
  days!: number; // Number of working days

  @Column({ type: 'boolean', default: false })
  isHalfDay!: boolean;

  @Column({ type: 'text', nullable: true })
  reason?: string;

  @Column({ type: 'text', nullable: true })
  rejectionReason?: string;

  @Column({ type: 'timestamp', nullable: true })
  approvedAt?: Date;

  @Column({ nullable: true })
  supportingDocumentUrl?: string; // Medical certificate, etc.

  @Column({ type: 'text', nullable: true })
  notes?: string;

  // Relations
  @ManyToOne(() => Consultant, { nullable: false })
  @JoinColumn({ name: 'consultantId' })
  consultant!: Consultant;

  @Column()
  consultantId!: number;

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
