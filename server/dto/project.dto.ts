import {
  IsString,
  IsEnum,
  IsOptional,
  IsNumber,
  IsDateString,
  IsBoolean,
  IsArray,
  IsNotEmpty,
  Min,
} from 'class-validator';
import { ProjectStatus } from '../entity/Project';

export class CreateProjectDto {
  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsEnum(ProjectStatus)
  @IsOptional()
  status?: ProjectStatus;

  @IsDateString()
  startDate!: string;

  @IsDateString()
  @IsOptional()
  endDate?: string;

  @IsNumber()
  @Min(0)
  @IsOptional()
  budget?: number;

  @IsNumber()
  @Min(0)
  @IsOptional()
  dailyRate?: number;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  technologies?: string[];

  @IsString()
  @IsOptional()
  location?: string;

  @IsBoolean()
  @IsOptional()
  isRemote?: boolean;

  @IsString()
  @IsOptional()
  notes?: string;

  @IsNumber()
  @IsNotEmpty()
  clientId!: number;

  @IsNumber()
  @IsOptional()
  consultantId?: number;
}

export class UpdateProjectDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsEnum(ProjectStatus)
  @IsOptional()
  status?: ProjectStatus;

  @IsDateString()
  @IsOptional()
  startDate?: string;

  @IsDateString()
  @IsOptional()
  endDate?: string;

  @IsNumber()
  @Min(0)
  @IsOptional()
  budget?: number;

  @IsNumber()
  @Min(0)
  @IsOptional()
  dailyRate?: number;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  technologies?: string[];

  @IsString()
  @IsOptional()
  location?: string;

  @IsBoolean()
  @IsOptional()
  isRemote?: boolean;

  @IsString()
  @IsOptional()
  notes?: string;

  @IsNumber()
  @IsOptional()
  clientId?: number;

  @IsNumber()
  @IsOptional()
  consultantId?: number;
}
