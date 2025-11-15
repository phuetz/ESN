import { IsString, IsEnum, IsOptional, IsNumber, IsDate, IsArray, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';
import { InterviewType, InterviewStatus, InterviewOutcome } from '../entity/Interview';

export class CreateInterviewDto {
  @IsString()
  title!: string;

  @IsEnum(InterviewType)
  type!: InterviewType;

  @Type(() => Date)
  @IsDate()
  scheduledAt!: Date;

  @IsOptional()
  @IsNumber()
  duration?: number;

  @IsOptional()
  @IsString()
  location?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsNumber()
  candidateId!: number;

  @IsOptional()
  @IsArray()
  @IsNumber({}, { each: true })
  interviewers?: number[];
}

export class UpdateInterviewDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsEnum(InterviewType)
  type?: InterviewType;

  @IsOptional()
  @IsEnum(InterviewStatus)
  status?: InterviewStatus;

  @IsOptional()
  @IsEnum(InterviewOutcome)
  outcome?: InterviewOutcome;

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  scheduledAt?: Date;

  @IsOptional()
  @IsNumber()
  duration?: number;

  @IsOptional()
  @IsString()
  location?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  feedback?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(10)
  technicalScore?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(10)
  cultureFitScore?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(10)
  communicationScore?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(10)
  overallScore?: number;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  strengths?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  weaknesses?: string[];

  @IsOptional()
  @IsArray()
  @IsNumber({}, { each: true })
  interviewers?: number[];
}
