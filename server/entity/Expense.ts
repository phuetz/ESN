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
import { Project } from './Project';

export enum ExpenseCategory {
  TRAVEL = 'travel',
  MEALS = 'meals',
  ACCOMMODATION = 'accommodation',
  TRANSPORTATION = 'transportation',
  SUPPLIES = 'supplies',
  TRAINING = 'training',
  OTHER = 'other',
}

export enum ExpenseStatus {
  DRAFT = 'draft',
  SUBMITTED = 'submitted',
  APPROVED = 'approved',
  REJECTED = 'rejected',
  PAID = 'paid',
}

/**
 * Expense entity - Expense report management
 * Track and approve consultant expenses
 */
@Entity('expenses')
export class Expense {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  title!: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column({
    type: 'text',
    enum: ExpenseCategory,
  })
  category!: ExpenseCategory;

  @Column({
    type: 'text',
    enum: ExpenseStatus,
    default: ExpenseStatus.DRAFT,
  })
  status!: ExpenseStatus;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  amount!: number;

  @Column({ default: 'EUR' })
  currency!: string;

  @Column({ type: 'date' })
  expenseDate!: Date;

  @Column({ nullable: true })
  receiptUrl?: string; // Receipt/proof file URL

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  mileage?: number; // For mileage expenses

  @Column({ nullable: true })
  vendor?: string; // Merchant/vendor name

  @Column({ nullable: true })
  paymentMethod?: string; // Card, cash, etc.

  @Column({ type: 'boolean', default: false })
  isReimbursable!: boolean;

  @Column({ type: 'boolean', default: false })
  isBillable!: boolean; // Can be billed to client

  @Column({ type: 'text', nullable: true })
  rejectionReason?: string;

  @Column({ type: 'timestamp', nullable: true })
  submittedAt?: Date;

  @Column({ type: 'timestamp', nullable: true })
  approvedAt?: Date;

  @Column({ type: 'timestamp', nullable: true })
  paidAt?: Date;

  // Relations
  @ManyToOne(() => Consultant, { nullable: false })
  @JoinColumn({ name: 'consultantId' })
  consultant!: Consultant;

  @Column()
  consultantId!: number;

  @ManyToOne(() => Project, { nullable: true })
  @JoinColumn({ name: 'projectId' })
  project?: Project;

  @Column({ nullable: true })
  projectId?: number;

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
