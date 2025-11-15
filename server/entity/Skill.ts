import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { ConsultantSkill } from './ConsultantSkill';

export enum SkillCategory {
  TECHNICAL = 'technical',
  FRAMEWORK = 'framework',
  LANGUAGE = 'language',
  TOOL = 'tool',
  SOFT_SKILL = 'soft_skill',
  METHODOLOGY = 'methodology',
  DOMAIN = 'domain',
}

/**
 * Skill entity - Skills catalog
 * Master list of all skills in the organization
 */
@Entity('skills')
export class Skill {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ unique: true })
  name!: string;

  @Column({
    type: 'text',
    enum: SkillCategory,
    default: SkillCategory.TECHNICAL,
  })
  category!: SkillCategory;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column({ type: 'boolean', default: true })
  isActive!: boolean;

  @Column({ type: 'simple-json', nullable: true })
  aliases?: string[]; // Alternative names for the skill

  // Relations
  @OneToMany(() => ConsultantSkill, (cs) => cs.skill)
  consultantSkills?: ConsultantSkill[];

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
