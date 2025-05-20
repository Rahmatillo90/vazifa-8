import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { DataBaseService } from 'src/core/database/database.service';

@Injectable()
export class ActiveSubscriptionGuard implements CanActivate {
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
      },
    });

    if (!subscription) {
      throw new ForbiddenException('You do not have an active subscription');
    }

    return true;
  }
}
