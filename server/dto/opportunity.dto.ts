import { IsString, IsEnum, IsOptional, IsNumber, IsDate, IsArray, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';
import { OpportunityStage, OpportunityPriority } from '../entity/Opportunity';

export class CreateOpportunityDto {
  @IsString()
  title!: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsEnum(OpportunityStage)
  stage!: OpportunityStage;

  @IsEnum(OpportunityPriority)
  priority!: OpportunityPriority;

  @IsOptional()
  @IsNumber()
  estimatedValue?: number;

  @IsNumber()
  @Min(0)
  @Max(100)
  probability!: number;

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  expectedCloseDate?: Date;

  @IsOptional()
  @IsString()
  source?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  requirements?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  competitors?: string[];

  @IsOptional()
  @IsString()
  notes?: string;

  @IsOptional()
  @IsNumber()
  clientId?: number;

  @IsNumber()
  ownerId!: number;
}

export class UpdateOpportunityDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsEnum(OpportunityStage)
  stage?: OpportunityStage;

  @IsOptional()
  @IsEnum(OpportunityPriority)
  priority?: OpportunityPriority;

  @IsOptional()
  @IsNumber()
  estimatedValue?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  probability?: number;

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  expectedCloseDate?: Date;

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  actualCloseDate?: Date;

  @IsOptional()
  @IsString()
  source?: string;

  @IsOptional()
  @IsString()
  lostReason?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  requirements?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  competitors?: string[];

  @IsOptional()
  @IsString()
  notes?: string;

  @IsOptional()
  @IsNumber()
  clientId?: number;

  @IsOptional()
  @IsNumber()
  ownerId?: number;
}
