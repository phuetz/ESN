import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  OneToMany,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Interview } from './Interview';
import { User } from './User';

export enum CandidateStatus {
  NEW = 'new',
  SCREENING = 'screening',
  INTERVIEWING = 'interviewing',
  OFFER = 'offer',
  HIRED = 'hired',
  REJECTED = 'rejected',
  WITHDRAWN = 'withdrawn',
}

export enum CandidateSource {
  LINKEDIN = 'linkedin',
  WEBSITE = 'website',
  REFERRAL = 'referral',
  JOBBOARD = 'jobboard',
  AGENCY = 'agency',
  OTHER = 'other',
}

/**
 * Candidate entity - Recruitment pipeline
 * Track candidates through hiring process
 */
@Entity('candidates')
export class Candidate {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  firstName!: string;

  @Column()
  lastName!: string;

  @Column()
  email!: string;

  @Column({ nullable: true })
  phone?: string;

  @Column({ nullable: true })
  currentPosition?: string;

  @Column({ nullable: true })
  currentCompany?: string;

  @Column({ type: 'int', default: 0 })
  yearsOfExperience!: number;

  @Column({ type: 'simple-json', nullable: true })
  skills?: string[];

  @Column({ nullable: true })
  linkedin?: string;

  @Column({ nullable: true })
  github?: string;

  @Column({ nullable: true })
  portfolio?: string;

  @Column({ nullable: true })
  resumeUrl?: string; // CV/Resume file URL

  @Column({
    type: 'text',
    enum: CandidateStatus,
    default: CandidateStatus.NEW,
  })
  status!: CandidateStatus;

  @Column({
    type: 'text',
    enum: CandidateSource,
    default: CandidateSource.OTHER,
  })
  source!: CandidateSource;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  expectedSalary?: number;

  @Column({ nullable: true })
  location?: string;

  @Column({ type: 'boolean', default: false })
  willingToRelocate!: boolean;

  @Column({ type: 'date', nullable: true })
  availableFrom?: Date;

  @Column({ type: 'text', nullable: true })
  notes?: string;

  @Column({ type: 'int', default: 0 })
  rating!: number; // 0-5 stars

  @Column({ nullable: true })
  rejectionReason?: string;

  // Relations
  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'recruiterId' })
  recruiter?: User; // Recruiter handling this candidate

  @Column({ nullable: true })
  recruiterId?: number;

  @OneToMany(() => Interview, (interview) => interview.candidate)
  interviews?: Interview[];

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @DeleteDateColumn()
  deletedAt?: Date;
}
