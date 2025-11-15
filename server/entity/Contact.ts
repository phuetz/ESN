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
import { Activity } from './Activity';

export enum ContactRole {
  PRIMARY = 'primary',
  SECONDARY = 'secondary',
  DECISION_MAKER = 'decision_maker',
  TECHNICAL = 'technical',
  BILLING = 'billing',
}

/**
 * Contact entity - Multiple contacts per client
 * Supports Boond Manager's multi-contact management
 */
@Entity('contacts')
export class Contact {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  firstName!: string;

  @Column()
  lastName!: string;

  @Column({ nullable: true })
  title?: string; // Job title

  @Column()
  email!: string;

  @Column({ nullable: true })
  phone?: string;

  @Column({ nullable: true })
  mobile?: string;

  @Column({
    type: 'text',
    enum: ContactRole,
    default: ContactRole.SECONDARY,
  })
  role!: ContactRole;

  @Column({ type: 'boolean', default: true })
  isPrimary!: boolean; // Primary contact for this client

  @Column({ nullable: true })
  linkedin?: string;

  @Column({ type: 'text', nullable: true })
  notes?: string;

  @Column({ type: 'simple-json', nullable: true })
  preferences?: Record<string, any>; // Communication preferences, etc.

  // Relations
  @ManyToOne(() => Client, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'clientId' })
  client!: Client;

  @Column()
  clientId!: number;

  @OneToMany(() => Activity, (activity) => activity.contact)
  activities?: Activity[];

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @DeleteDateColumn()
  deletedAt?: Date;
}
