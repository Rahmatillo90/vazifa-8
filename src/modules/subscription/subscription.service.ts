import {
  BadRequestException,
  ConflictException,
  HttpException,
  Injectable,
} from '@nestjs/common';
import { CreateUserSubscriptionDto } from './dto/user-subscription.dto';
import { DataBaseService } from 'src/core/database/database.service';
import { calculateEndDateManual } from './unit/plan-unit';

@Injectable()
export class SubscriptionService {
  constructor(private readonly database: DataBaseService) {}

  async getSubscriptionPlans() {
    try {
      return await this.database.subscriptionPlan.findMany({
        select: {
          id: true,
          name: true,
          price: true,
          duration: true,
          unit: true,
          features: true,
          isActive: true,
          createdAt: true,
        },
      });
    } catch (error) {
      throw new HttpException(error.message, 500);
    }
  }

  async subscribe(userId: string, dto: CreateUserSubscriptionDto) {
    const myPlan = await this.database.subscriptionPlan.findFirst({
      where: { id: dto.planId, isActive: true },
    });
    if (!myPlan) throw new BadRequestException(`Invalid Subscription Plan`);

    const existing = await this.database.userSubscription.findFirst({
      where: {
        userId,
        endDate: { gt: new Date() },
        status: 'ACTIVE',
      },
    });
    if (existing)
      throw new ConflictException('You already have an active subscription');

    try {
      const startDate = new Date();
      let endDate: Date | undefined = undefined;
      if (myPlan.duration > 0 && myPlan.price > 0)
        endDate = calculateEndDateManual(
          startDate,
          myPlan.duration,
          myPlan.unit,
        );

      const mySubscribe = await this.database.userSubscription.create({
        data: {
          userId,
          planId: dto.planId,
          startDate,
          endDate,
          autoRenew: dto.autoRenew,
          status: myPlan.price > 0 ? 'PENDING_PAYMENT' : 'ACTIVE',
        },
        include: { plan: true },
      });

      let payment: any = null;
      if (myPlan.price > 0) {
        payment = await this.database.payment.create({
          data: {
            userSubscriptionId: mySubscribe.id,
            amount: myPlan.price,
            paymentMethod: dto.paymentMethod,
            paymentDetails: dto.paymentDetails,
            status: 'COMPLETED',
            externalTransactionId:
              'txn_' + Math.random().toString().slice(2, 11),
          },
        });

        await this.database.userSubscription.update({
          where: { id: mySubscribe.id },
          data: {
            status: 'ACTIVE',
          },
        });
      }

      return {
        subscription: {
          id: mySubscribe.id,
          plan: { id: dto.planId, name: myPlan.name },
        },
        start_date: mySubscribe.startDate,
        end_date: mySubscribe.endDate,
        status: 'active',
        auto_renew: mySubscribe.autoRenew,
        payment: payment
          ? {
              id: payment.id,
              amount: payment.amount,
              status: payment.status.toLowerCase(),
              external_transaction_id: payment.externalTransactionId,
              payment_method: payment.paymentMethod.toLowerCase(),
            }
          : null,
      };
    } catch (error) {
      throw new HttpException(error.message, 500);
    }
  }

  async mySubscribeStatus(userId: string) {
    try {
      const sub = await this.database.userSubscription.findFirst({
        where: { userId, status: 'ACTIVE' },
        include: { plan: true },
      });

      if (sub)
        return {
          subscription: {
            id: sub.id,
            plan: {
              id: sub.plan.id,
              name: sub.plan.name,
              price: sub.plan.price,
              features: sub.plan.features,
            },
            startDate: sub.startDate,
            endDate: sub.endDate,
            status: sub.status,
            autoRenew: sub.autoRenew,
          },
        };
    } catch (error) {
      throw new HttpException(error.message, 500);
    }
  }
}
