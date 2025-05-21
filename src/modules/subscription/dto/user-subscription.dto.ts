import {
  IsString,
  IsBoolean,
  IsDateString,
  IsOptional,
  IsEnum,
  IsJSON,
} from 'class-validator';
import { PaymentMethod } from 'src/common/@types/literal.enum';

export type SubscriptionStatus =
  | 'ACTIVE'
  | 'EXPIRED'
  | 'CANCELED'
  | 'PENDING_PAYMENT';

export class CreateUserSubscriptionDto {
  @IsString()
  planId: string;

  @IsEnum(['CARD', 'CLICK', 'PAYME', 'OTHER'] as const, {
    message: 'Invalid payment method',
  })
  paymentMethod: PaymentMethod;

  @IsOptional()
  @IsJSON()
  paymentDetails?: any;

  @IsOptional()
  @IsBoolean()
  autoRenew?: boolean;
}

export class UpdateUserSubscriptionDto {
  @IsOptional()
  @IsDateString()
  endDate?: string;

  @IsOptional()
  @IsString()
  status?: SubscriptionStatus;

  @IsOptional()
  @IsBoolean()
  autoRenew?: boolean;
}
