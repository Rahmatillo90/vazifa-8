import { BadRequestException } from '@nestjs/common';
import { PlanUnit } from 'src/common/@types/literal.enum';

export function calculateEndDateManual(
  startDate: Date,
  duration: number,
  unit: PlanUnit,
): Date {
  const endDate = new Date(startDate.getTime());

  switch (unit) {
    case 'DAY':
      endDate.setDate(endDate.getDate() + duration);
      break;
    case 'WEEK':
      endDate.setDate(endDate.getDate() + duration * 7);
      break;
    case 'MONTH':
      endDate.setMonth(endDate.getMonth() + duration);
      break;
    case 'YEAR':
      endDate.setFullYear(endDate.getFullYear() + duration);
      break;
    default:
      throw new BadRequestException('Invalid Plan-unit');
  }

  return endDate;
}
