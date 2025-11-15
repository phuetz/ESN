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
import { Activity } from './Activity';

export enum OpportunityStage {
  LEAD = 'lead',
  QUALIFIED = 'qualified',
  PROPOSAL = 'proposal',
  NEGOTIATION = 'negotiation',
  WON = 'won',
  LOST = 'lost',
}

export enum OpportunityPriority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  URGENT = 'urgent',
}

/**
 * Opportunity entity - CRM commercial pipeline
 * Tracks sales opportunities from lead to won/lost
 */
@Entity('opportunities')
export class Opportunity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  title!: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column({
    type: 'text',
    enum: OpportunityStage,
    default: OpportunityStage.LEAD,
  })
  stage!: OpportunityStage;

  @Column({
    type: 'text',
    enum: OpportunityPriority,
    default: OpportunityPriority.MEDIUM,
  })
  priority!: OpportunityPriority;

  @Column({ type: 'decimal', precision: 12, scale: 2, nullable: true })
  estimatedValue?: number; // Expected revenue

  @Column({ type: 'int', default: 0 })
  probability!: number; // 0-100% chance of winning

  @Column({ type: 'date', nullable: true })
  expectedCloseDate?: Date;

  @Column({ type: 'date', nullable: true })
  actualCloseDate?: Date;

  @Column({ type: 'text', nullable: true })
  source?: string; // How the opportunity was generated

  @Column({ type: 'text', nullable: true })
  lostReason?: string; // Why it was lost

  @Column({ type: 'simple-json', nullable: true })
  requirements?: string[]; // Client requirements/needs

  @Column({ type: 'simple-json', nullable: true })
  competitors?: string[]; // Competing companies

  @Column({ type: 'text', nullable: true })
  notes?: string;

  // Relations
  @ManyToOne(() => Client, { nullable: true })
  @JoinColumn({ name: 'clientId' })
  client?: Client;

  @Column({ nullable: true })
  clientId?: number;

  @ManyToOne(() => User, { nullable: false })
  @JoinColumn({ name: 'ownerId' })
  owner!: User; // Sales person responsible

  @Column()
  ownerId!: number;

  @OneToMany(() => Activity, (activity) => activity.opportunity)
  activities?: Activity[];

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @DeleteDateColumn()
  deletedAt?: Date;
}
