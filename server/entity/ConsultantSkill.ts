import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Consultant } from './Consultant';
import { Skill } from './Skill';

export enum ProficiencyLevel {
  BEGINNER = 'beginner',
  INTERMEDIATE = 'intermediate',
  ADVANCED = 'advanced',
  EXPERT = 'expert',
}

/**
 * ConsultantSkill entity - Junction table for consultant-skill relationship
 * Tracks skills and proficiency levels for each consultant
 */
@Entity('consultant_skills')
export class ConsultantSkill {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({
    type: 'text',
    enum: ProficiencyLevel,
    default: ProficiencyLevel.INTERMEDIATE,
  })
  level!: ProficiencyLevel;

  @Column({ type: 'int', default: 0 })
  yearsOfExperience!: number;

  @Column({ type: 'date', nullable: true })
  lastUsed?: Date;

  @Column({ type: 'boolean', default: false })
  isCertified!: boolean; // Has certification for this skill

  @Column({ type: 'boolean', default: false })
  isEndorsed!: boolean; // Endorsed by peers/managers

  @Column({ type: 'text', nullable: true })
  notes?: string;

  // Relations
  @ManyToOne(() => Consultant, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'consultantId' })
  consultant!: Consultant;

  @Column()
  consultantId!: number;

  @ManyToOne(() => Skill, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'skillId' })
  skill!: Skill;

  @Column()
  skillId!: number;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
