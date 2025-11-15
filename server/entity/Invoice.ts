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
import { Client } from './Client';
import { User } from './User';
import { Project } from './Project';
import { InvoiceItem } from './InvoiceItem';

export enum InvoiceStatus {
  DRAFT = 'draft',
  SENT = 'sent',
  PAID = 'paid',
  OVERDUE = 'overdue',
  CANCELLED = 'cancelled',
}

export enum InvoiceType {
  STANDARD = 'standard',
  RECURRING = 'recurring',
  CREDIT_NOTE = 'credit_note',
}

/**
 * Invoice entity - Billing and invoicing
 * Generate, track and manage invoices
 */
@Entity('invoices')
export class Invoice {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ unique: true })
  invoiceNumber!: string; // e.g., "INV-2025-001"

  @Column({
    type: 'text',
    enum: InvoiceType,
    default: InvoiceType.STANDARD,
  })
  type!: InvoiceType;

  @Column({
    type: 'text',
    enum: InvoiceStatus,
    default: InvoiceStatus.DRAFT,
  })
  status!: InvoiceStatus;

  @Column({ type: 'date' })
  issueDate!: Date;

  @Column({ type: 'date' })
  dueDate!: Date;

  @Column({ type: 'date', nullable: true })
  paidDate?: Date;

  @Column({ type: 'decimal', precision: 12, scale: 2, default: 0 })
  subtotal!: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, default: 20 })
  taxRate!: number; // VAT/GST percentage

  @Column({ type: 'decimal', precision: 12, scale: 2, default: 0 })
  taxAmount!: number;

  @Column({ type: 'decimal', precision: 12, scale: 2, default: 0 })
  discount!: number;

  @Column({ type: 'decimal', precision: 12, scale: 2, default: 0 })
  total!: number;

  @Column({ type: 'decimal', precision: 12, scale: 2, default: 0 })
  amountPaid!: number;

  @Column({ type: 'decimal', precision: 12, scale: 2, default: 0 })
  amountDue!: number;

  @Column({ default: 'EUR' })
  currency!: string;

  @Column({ type: 'text', nullable: true })
  paymentTerms?: string;

  @Column({ type: 'text', nullable: true })
  notes?: string;

  @Column({ nullable: true })
  pdfUrl?: string; // Generated PDF URL

  @Column({ type: 'text', nullable: true })
  paymentMethod?: string; // Bank transfer, card, etc.

  @Column({ type: 'text', nullable: true })
  paymentReference?: string;

  // Relations
  @ManyToOne(() => Client, { nullable: false })
  @JoinColumn({ name: 'clientId' })
  client!: Client;

  @Column()
  clientId!: number;

  @ManyToOne(() => Project, { nullable: true })
  @JoinColumn({ name: 'projectId' })
  project?: Project;

  @Column({ nullable: true })
  projectId?: number;

  @ManyToOne(() => User, { nullable: false })
  @JoinColumn({ name: 'createdById' })
  createdBy!: User;

  @Column()
  createdById!: number;

  @OneToMany(() => InvoiceItem, (item) => item.invoice, { cascade: true })
  items?: InvoiceItem[];

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @DeleteDateColumn()
  deletedAt?: Date;
}
