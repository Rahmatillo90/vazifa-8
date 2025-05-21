import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Request } from 'express';
import { DataBaseService } from 'src/core/database/database.service';

@Injectable()
export class ActiveSubscriptionGuard implements CanActivate {
  constructor(private prisma: DataBaseService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: Request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user) {
      throw new ForbiddenException('User not authenticated');
    }

    const subscription = await this.prisma.userSubscription.findFirst({
      where: {
        userId: user.id,
        status: 'ACTIVE',
      },
    });

    if (!subscription) {
      throw new ForbiddenException('You do not have an active subscription');
    }

    const isPremium = await this.prisma.userSubscription.findFirst({
      where: {
        userId: user.id,
        status: 'ACTIVE',
        plan: {
          price: {
            gt: 0,
          },
        },
        endDate: { gt: new Date() },
      },
    });
    if (isPremium) request.subscribe = { type: 'PREMIUM' };
    request.subscribe = { type: 'FREE' };

    return true;
  }
}
