import {
  IsBoolean,
  IsEnum,
  IsLatitude,
  IsLongitude,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';
import { WorkerStatus } from '@prisma/client';

export class CreateWorkerDto {
  @IsString()
  @MinLength(2)
  fullName: string;

  @IsString()
  crossing: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  photoUrl?: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsLatitude()
  latitude?: number;

  @IsOptional()
  @IsLongitude()
  longitude?: number;
}

/// DTO para el auto-registro público del trabajador.
/// Igual que crear, pero sin campos de gestión (status/active los fija el sistema).
export class RegisterWorkerDto extends CreateWorkerDto {}

/// DTO para que el admin apruebe o rechace un trabajador.
export class UpdateStatusDto {
  @IsEnum(WorkerStatus)
  status: WorkerStatus;
}

export class UpdateWorkerDto {
  @IsOptional()
  @IsString()
  @MinLength(2)
  fullName?: string;

  @IsOptional()
  @IsString()
  crossing?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  photoUrl?: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsLatitude()
  latitude?: number;

  @IsOptional()
  @IsLongitude()
  longitude?: number;

  @IsOptional()
  @IsBoolean()
  active?: boolean;
}
