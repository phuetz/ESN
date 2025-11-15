import { IsEnum, IsOptional, IsNumber, IsDate, IsBoolean, IsString } from 'class-validator';
import { Type } from 'class-transformer';
import { LeaveType, LeaveStatus } from '../entity/Leave';

export class CreateLeaveDto {
  @IsEnum(LeaveType)
  type!: LeaveType;

  @Type(() => Date)
  @IsDate()
  startDate!: Date;

  @Type(() => Date)
  @IsDate()
  endDate!: Date;

  @IsNumber()
  days!: number;

  @IsOptional()
  @IsBoolean()
  isHalfDay?: boolean;

  @IsOptional()
  @IsString()
  reason?: string;

  @IsOptional()
  @IsString()
  supportingDocumentUrl?: string;

  @IsOptional()
  @IsString()
  notes?: string;

  @IsNumber()
  consultantId!: number;
}

export class UpdateLeaveDto {
  @IsOptional()
  @IsEnum(LeaveType)
  type?: LeaveType;

  @IsOptional()
  @IsEnum(LeaveStatus)
  status?: LeaveStatus;

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
  days?: number;

  @IsOptional()
  @IsBoolean()
  isHalfDay?: boolean;

  @IsOptional()
  @IsString()
  reason?: string;

  @IsOptional()
  @IsString()
  rejectionReason?: string;

  @IsOptional()
  @IsString()
  supportingDocumentUrl?: string;

  @IsOptional()
  @IsString()
  notes?: string;
}
