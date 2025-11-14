import {
  IsString,
  IsEmail,
  IsOptional,
  IsEnum,
  IsNotEmpty,
} from 'class-validator';
import { ClientType, ClientStatus } from '../entity/Client';

export class CreateClientDto {
  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsEnum(ClientType)
  @IsOptional()
  type?: ClientType;

  @IsString()
  @IsOptional()
  sector?: string;

  @IsString()
  @IsOptional()
  contactName?: string;

  @IsEmail()
  @IsOptional()
  contactEmail?: string;

  @IsString()
  @IsOptional()
  contactPhone?: string;

  @IsString()
  @IsOptional()
  website?: string;

  @IsString()
  @IsOptional()
  address?: string;

  @IsString()
  @IsOptional()
  city?: string;

  @IsString()
  @IsOptional()
  postalCode?: string;

  @IsString()
  @IsOptional()
  country?: string;

  @IsString()
  @IsOptional()
  notes?: string;

  @IsEnum(ClientStatus)
  @IsOptional()
  status?: ClientStatus;
}

export class UpdateClientDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsEnum(ClientType)
  @IsOptional()
  type?: ClientType;

  @IsString()
  @IsOptional()
  sector?: string;

  @IsString()
  @IsOptional()
  contactName?: string;

  @IsEmail()
  @IsOptional()
  contactEmail?: string;

  @IsString()
  @IsOptional()
  contactPhone?: string;

  @IsString()
  @IsOptional()
  website?: string;

  @IsString()
  @IsOptional()
  address?: string;

  @IsString()
  @IsOptional()
  city?: string;

  @IsString()
  @IsOptional()
  postalCode?: string;

  @IsString()
  @IsOptional()
  country?: string;

  @IsString()
  @IsOptional()
  notes?: string;

  @IsEnum(ClientStatus)
  @IsOptional()
  status?: ClientStatus;
}
