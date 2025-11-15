import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Quote } from './Quote';

/**
 * QuoteItem entity - Line items in a quote
 */
@Entity('quote_items')
export class QuoteItem {
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

  @Column({ type: 'int', default: 0 })
  order!: number; // Display order

  // Relations
  @ManyToOne(() => Quote, (quote) => quote.items, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'quoteId' })
  quote!: Quote;

  @Column()
  quoteId!: number;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
