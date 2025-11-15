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
import { Client } from './Client';
import { Contact } from './Contact';
import { Opportunity } from './Opportunity';

export enum ActivityType {
  CALL = 'call',
  EMAIL = 'email',
  MEETING = 'meeting',
  TASK = 'task',
  NOTE = 'note',
}

export enum ActivityStatus {
  PLANNED = 'planned',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
}

/**
 * Activity entity - CRM activity tracking
 * Track calls, emails, meetings with clients and prospects
 */
@Entity('activities')
export class Activity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  subject!: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column({
    type: 'text',
    enum: ActivityType,
  })
  type!: ActivityType;

  @Column({
    type: 'text',
    enum: ActivityStatus,
    default: ActivityStatus.PLANNED,
  })
  status!: ActivityStatus;

  @Column({ type: 'timestamp', nullable: true })
  scheduledAt?: Date;

  @Column({ type: 'timestamp', nullable: true })
  completedAt?: Date;

  @Column({ type: 'int', nullable: true })
  duration?: number; // Duration in minutes

  @Column({ nullable: true })
  location?: string; // For meetings

  @Column({ type: 'text', nullable: true })
  outcome?: string; // Result of the activity

  @Column({ type: 'simple-json', nullable: true })
  attendees?: string[]; // Email addresses of attendees

  @Column({ type: 'boolean', default: false })
  isAllDay!: boolean;

  // Relations
  @ManyToOne(() => User, { nullable: false })
  @JoinColumn({ name: 'ownerId' })
  owner!: User;

  @Column()
  ownerId!: number;

  @ManyToOne(() => Client, { nullable: true })
  @JoinColumn({ name: 'clientId' })
  client?: Client;

  @Column({ nullable: true })
  clientId?: number;

  @ManyToOne(() => Contact, { nullable: true })
  @JoinColumn({ name: 'contactId' })
  contact?: Contact;

  @Column({ nullable: true })
  contactId?: number;

  @ManyToOne(() => Opportunity, { nullable: true })
  @JoinColumn({ name: 'opportunityId' })
  opportunity?: Opportunity;

  @Column({ nullable: true })
  opportunityId?: number;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @DeleteDateColumn()
  deletedAt?: Date;
}
