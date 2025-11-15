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

export enum DocumentType {
  CV = 'cv',
  PROPOSAL = 'proposal',
  CONTRACT = 'contract',
  INVOICE = 'invoice',
  QUOTE = 'quote',
  REPORT = 'report',
  CERTIFICATE = 'certificate',
  OTHER = 'other',
}

export enum DocumentCategory {
  CONSULTANT = 'consultant',
  CLIENT = 'client',
  PROJECT = 'project',
  HR = 'hr',
  FINANCE = 'finance',
  LEGAL = 'legal',
}

/**
 * Document entity - Document management
 * Store and manage business documents
 */
@Entity('documents')
export class Document {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name!: string;

  @Column({
    type: 'text',
    enum: DocumentType,
  })
  type!: DocumentType;

  @Column({
    type: 'text',
    enum: DocumentCategory,
  })
  category!: DocumentCategory;

  @Column()
  fileUrl!: string; // S3, local storage, etc.

  @Column({ nullable: true })
  fileName?: string;

  @Column({ nullable: true })
  mimeType?: string;

  @Column({ type: 'int', nullable: true })
  fileSize?: number; // In bytes

  @Column({ type: 'int', default: 1 })
  version!: number;

  @Column({ type: 'boolean', default: false })
  isTemplate!: boolean;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column({ type: 'simple-json', nullable: true })
  tags?: string[];

  @Column({ type: 'simple-json', nullable: true })
  metadata?: Record<string, any>; // Template variables, etc.

  // Relations to entities (optional - depends on category)
  @Column({ nullable: true })
  relatedEntityType?: string; // 'consultant', 'client', 'project', etc.

  @Column({ nullable: true })
  relatedEntityId?: number;

  @ManyToOne(() => User, { nullable: false })
  @JoinColumn({ name: 'uploadedById' })
  uploadedBy!: User;

  @Column()
  uploadedById!: number;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @DeleteDateColumn()
  deletedAt?: Date;
}
