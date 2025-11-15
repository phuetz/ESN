import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from './User';

export enum NotificationType {
  INFO = 'info',
  SUCCESS = 'success',
  WARNING = 'warning',
  ERROR = 'error',
}

export enum NotificationCategory {
  SYSTEM = 'system',
  PROJECT = 'project',
  INVOICE = 'invoice',
  LEAVE = 'leave',
  EXPENSE = 'expense',
  MISSION = 'mission',
  OPPORTUNITY = 'opportunity',
  CANDIDATE = 'candidate',
}

/**
 * Notification entity - User notifications and alerts
 * System-wide notification center
 */
@Entity('notifications')
export class Notification {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  title!: string;

  @Column({ type: 'text' })
  message!: string;

  @Column({
    type: 'text',
    enum: NotificationType,
    default: NotificationType.INFO,
  })
  type!: NotificationType;

  @Column({
    type: 'text',
    enum: NotificationCategory,
    default: NotificationCategory.SYSTEM,
  })
  category!: NotificationCategory;

  @Column({ type: 'boolean', default: false })
  isRead!: boolean;

  @Column({ nullable: true })
  link?: string; // URL to navigate to when clicked

  @Column({ type: 'simple-json', nullable: true })
  metadata?: Record<string, any>; // Additional data

  @Column({ type: 'timestamp', nullable: true })
  readAt?: Date;

  // Relations
  @ManyToOne(() => User, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user!: User;

  @Column()
  userId!: number;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
