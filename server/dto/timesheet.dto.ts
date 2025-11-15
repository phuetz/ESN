import { IsEnum, IsOptional, IsNumber, IsDate, IsBoolean, IsString } from 'class-validator';
import { Type } from 'class-transformer';
import { TimesheetStatus } from '../entity/Timesheet';

export class CreateTimesheetDto {
  @Type(() => Date)
  @IsDate()
  date!: Date;

  @IsNumber()
  hours!: number;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsBoolean()
  isBillable?: boolean;

  @IsOptional()
  @IsBoolean()
  isOvertime?: boolean;

  @IsNumber()
  consultantId!: number;

  @IsNumber()
  missionId!: number;
}

export class UpdateTimesheetDto {
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  date?: Date;

  @IsOptional()
  @IsNumber()
  hours?: number;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsEnum(TimesheetStatus)
  status?: TimesheetStatus;

  @IsOptional()
  @IsBoolean()
  isBillable?: boolean;

  @IsOptional()
  @IsBoolean()
  isOvertime?: boolean;

  @IsOptional()
  @IsString()
  rejectionReason?: string;

  @IsOptional()
  @IsNumber()
  invoiceId?: number;
}
