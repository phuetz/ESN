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
import { QuoteItem } from './QuoteItem';
import { Opportunity } from './Opportunity';

export enum QuoteStatus {
  DRAFT = 'draft',
  SENT = 'sent',
  VIEWED = 'viewed',
  ACCEPTED = 'accepted',
  REJECTED = 'rejected',
  EXPIRED = 'expired',
}

/**
 * Quote entity - Commercial proposals
 * Generate and track quotes/proposals sent to clients
 */
@Entity('quotes')
export class Quote {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ unique: true })
  quoteNumber!: string; // e.g., "Q-2025-001"

  @Column()
  title!: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column({
    type: 'text',
    enum: QuoteStatus,
    default: QuoteStatus.DRAFT,
  })
  status!: QuoteStatus;

  @Column({ type: 'date' })
  issueDate!: Date;

  @Column({ type: 'date' })
  validUntil!: Date;

  @Column({ type: 'decimal', precision: 12, scale: 2, default: 0 })
  subtotal!: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, default: 0 })
  taxRate!: number; // VAT/GST percentage

  @Column({ type: 'decimal', precision: 12, scale: 2, default: 0 })
  taxAmount!: number;

  @Column({ type: 'decimal', precision: 12, scale: 2, default: 0 })
  discount!: number; // Discount amount

  @Column({ type: 'decimal', precision: 12, scale: 2, default: 0 })
  total!: number;

  @Column({ type: 'text', nullable: true })
  terms?: string; // Payment terms and conditions

  @Column({ type: 'text', nullable: true })
  notes?: string;

  @Column({ nullable: true })
  signatureUrl?: string; // E-signature URL

  @Column({ type: 'timestamp', nullable: true })
  signedAt?: Date;

  @Column({ nullable: true })
  pdfUrl?: string; // Generated PDF URL

  // Relations
  @ManyToOne(() => Client, { nullable: false })
  @JoinColumn({ name: 'clientId' })
  client!: Client;

  @Column()
  clientId!: number;

  @ManyToOne(() => User, { nullable: false })
  @JoinColumn({ name: 'createdById' })
  createdBy!: User;

  @Column()
  createdById!: number;

  @ManyToOne(() => Opportunity, { nullable: true })
  @JoinColumn({ name: 'opportunityId' })
  opportunity?: Opportunity;

  @Column({ nullable: true })
  opportunityId?: number;

  @OneToMany(() => QuoteItem, (item) => item.quote, { cascade: true })
  items?: QuoteItem[];

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @DeleteDateColumn()
  deletedAt?: Date;
}
