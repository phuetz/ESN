import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Invoice } from './Invoice';

/**
 * InvoiceItem entity - Line items in an invoice
 */
@Entity('invoice_items')
export class InvoiceItem {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  description!: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  quantity!: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  unitPrice!: number;

  @Column({ type: 'decimal', precision: 12, scale: 2 })
  amount!: number; // quantity * unitPrice

  @Column({ nullable: true })
  unit?: string; // e.g., "day", "hour", "month"

  @Column({ type: 'decimal', precision: 5, scale: 2, default: 0 })
  taxRate!: number; // Individual tax rate if different from invoice

  @Column({ type: 'int', default: 0 })
  order!: number; // Display order

  // Relations
  @ManyToOne(() => Invoice, (invoice) => invoice.items, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'invoiceId' })
  invoice!: Invoice;

  @Column()
  invoiceId!: number;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
