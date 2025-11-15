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
import { Candidate } from './Candidate';
import { User } from './User';

export enum InterviewType {
  PHONE = 'phone',
  VIDEO = 'video',
  IN_PERSON = 'in_person',
  TECHNICAL = 'technical',
  HR = 'hr',
  FINAL = 'final',
}

export enum InterviewStatus {
  SCHEDULED = 'scheduled',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
  NO_SHOW = 'no_show',
}

export enum InterviewOutcome {
  PENDING = 'pending',
  PASS = 'pass',
  FAIL = 'fail',
  STRONG_YES = 'strong_yes',
  YES = 'yes',
  NO = 'no',
  STRONG_NO = 'strong_no',
}

/**
 * Interview entity - Recruitment interviews
 * Track and manage candidate interviews
 */
@Entity('interviews')
export class Interview {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  title!: string;

  @Column({
    type: 'text',
    enum: InterviewType,
  })
  type!: InterviewType;

  @Column({
    type: 'text',
    enum: InterviewStatus,
    default: InterviewStatus.SCHEDULED,
  })
  status!: InterviewStatus;

  @Column({
    type: 'text',
    enum: InterviewOutcome,
    default: InterviewOutcome.PENDING,
  })
  outcome!: InterviewOutcome;

  @Column({ type: 'timestamp' })
  scheduledAt!: Date;

  @Column({ type: 'int', default: 60 })
  duration!: number; // Duration in minutes

  @Column({ nullable: true })
  location?: string; // Office, meeting room, or video link

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column({ type: 'text', nullable: true })
  feedback?: string;

  @Column({ type: 'int', nullable: true })
  technicalScore?: number; // 0-10

  @Column({ type: 'int', nullable: true })
  cultureFitScore?: number; // 0-10

  @Column({ type: 'int', nullable: true })
  communicationScore?: number; // 0-10

  @Column({ type: 'int', nullable: true })
  overallScore?: number; // 0-10

  @Column({ type: 'simple-json', nullable: true })
  strengths?: string[];

  @Column({ type: 'simple-json', nullable: true })
  weaknesses?: string[];

  @Column({ type: 'simple-json', nullable: true })
  interviewers?: number[]; // User IDs of interviewers

  // Relations
  @ManyToOne(() => Candidate, (candidate) => candidate.interviews, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'candidateId' })
  candidate!: Candidate;

  @Column()
  candidateId!: number;

  @ManyToOne(() => User, { nullable: false })
  @JoinColumn({ name: 'createdById' })
  createdBy!: User;

  @Column()
  createdById!: number;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @DeleteDateColumn()
  deletedAt?: Date;
}
