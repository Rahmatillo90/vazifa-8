import { IsString, IsNumber, IsBoolean, IsOptional } from 'class-validator';

export class CreateSubscriptionPlanDto {
  @IsString()
  name: string;

  @IsNumber()
  price: number;

  @IsNumber()
  durationDays: number;

  @IsOptional()
  @IsString()
  features?: string;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}

export class UpdateSubscriptionPlanDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsNumber()
  price?: number;

  @IsOptional()
  @IsNumber()
  durationDays?: number;

  @IsOptional()
  @IsString()
  features?: string;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
