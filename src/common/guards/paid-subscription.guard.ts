import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { DataBaseService } from 'src/core/database/database.service';

@Injectable()
export class PaidSubscriptionGuard implements CanActivate {
  constructor(private prisma: DataBaseService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user) {
      throw new ForbiddenException('User not authenticated');
    }

    const subscription = await this.prisma.userSubscription.findFirst({
      where: {
        userId: user.id,
        endDate: { gt: new Date() },
        status: 'ACTIVE',
        plan: {
          price: {
            gt: 0,
          },
        },
      },
      include: {
        plan: true,
      },
    });

    if (!subscription) {
      throw new ForbiddenException('You must have an active paid subscription');
    }

    return true;
  }
}
