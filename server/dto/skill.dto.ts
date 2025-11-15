import { IsString, IsEnum, IsOptional, IsBoolean, IsArray } from 'class-validator';
import { SkillCategory } from '../entity/Skill';

export class CreateSkillDto {
  @IsString()
  name!: string;

  @IsEnum(SkillCategory)
  category!: SkillCategory;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  aliases?: string[];
}

export class UpdateSkillDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsEnum(SkillCategory)
  category?: SkillCategory;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  aliases?: string[];
}
