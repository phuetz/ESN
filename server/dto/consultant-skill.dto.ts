import { IsEnum, IsOptional, IsNumber, IsDate, IsBoolean, IsString } from 'class-validator';
import { Type } from 'class-transformer';
import { ProficiencyLevel } from '../entity/ConsultantSkill';

export class CreateConsultantSkillDto {
  @IsEnum(ProficiencyLevel)
  level!: ProficiencyLevel;

  @IsOptional()
  @IsNumber()
  yearsOfExperience?: number;

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  lastUsed?: Date;

  @IsOptional()
  @IsBoolean()
  isCertified?: boolean;

  @IsOptional()
  @IsBoolean()
  isEndorsed?: boolean;

  @IsOptional()
  @IsString()
  notes?: string;

  @IsNumber()
  consultantId!: number;

  @IsNumber()
  skillId!: number;
}

export class UpdateConsultantSkillDto {
  @IsOptional()
  @IsEnum(ProficiencyLevel)
  level?: ProficiencyLevel;

  @IsOptional()
  @IsNumber()
  yearsOfExperience?: number;

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  lastUsed?: Date;

  @IsOptional()
  @IsBoolean()
  isCertified?: boolean;

  @IsOptional()
  @IsBoolean()
  isEndorsed?: boolean;

  @IsOptional()
  @IsString()
  notes?: string;
}
