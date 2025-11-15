import { IsString, IsEnum, IsOptional, IsNumber, IsDate, IsArray, IsBoolean } from 'class-validator';
import { Type } from 'class-transformer';
import { MissionStatus } from '../entity/Mission';

export class CreateMissionDto {
  @IsString()
  title!: string;

  @IsOptional()
  @IsString()
  description?: string;

  @Type(() => Date)
  @IsDate()
  startDate!: Date;

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  endDate?: Date;

  @IsNumber()
  dailyRate!: number;

  @IsOptional()
  @IsNumber()
  clientRate?: number;

  @IsOptional()
  @IsNumber()
  allocatedPercentage?: number;

  @IsOptional()
  @IsString()
  location?: string;

  @IsOptional()
  @IsBoolean()
  isRemote?: boolean;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  requiredSkills?: string[];

  @IsOptional()
  @IsString()
  objectives?: string;

  @IsOptional()
  @IsString()
  deliverables?: string;

  @IsOptional()
  @IsNumber()
  alertDaysBefore?: number;

  @IsOptional()
  @IsString()
  notes?: string;

  @IsNumber()
  consultantId!: number;

  @IsNumber()
  projectId!: number;

  @IsNumber()
  clientId!: number;
}

export class UpdateMissionDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsEnum(MissionStatus)
  status?: MissionStatus;

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  startDate?: Date;

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  endDate?: Date;

  @IsOptional()
  @IsNumber()
  dailyRate?: number;

  @IsOptional()
  @IsNumber()
  clientRate?: number;

  @IsOptional()
  @IsNumber()
  allocatedPercentage?: number;

  @IsOptional()
  @IsString()
  location?: string;

  @IsOptional()
  @IsBoolean()
  isRemote?: boolean;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  requiredSkills?: string[];

  @IsOptional()
  @IsString()
  objectives?: string;

  @IsOptional()
  @IsString()
  deliverables?: string;

  @IsOptional()
  @IsNumber()
  alertDaysBefore?: number;

  @IsOptional()
  @IsBoolean()
  renewalRequested?: boolean;

  @IsOptional()
  @IsString()
  notes?: string;
}
