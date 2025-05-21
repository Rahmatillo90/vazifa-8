import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { SubscriptionService } from './subscription.service';
import { CreateUserSubscriptionDto } from './dto/user-subscription.dto';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { RoleGuard } from 'src/common/guards/role.guard';
import { Roles } from 'src/common/decorator/role.decorator';
import { Request } from 'express';
import { ActiveSubscriptionGuard } from 'src/common/guards/active-subscription.guard';

@Controller('subscriptions')
@UseGuards(AuthGuard, RoleGuard)
@Roles('USER')
export class SubscriptionController {
  constructor(private readonly subscriptionService: SubscriptionService) {}

  @Get('plans')
  async subscriptionPlans() {
    const data = await this.subscriptionService.getSubscriptionPlans();
    return { data };
  }

  @Post(`create`)
  async subscribe(
    @Req() req: Request,
    @Body() subscribeDto: CreateUserSubscriptionDto,
  ) {
    const data = await this.subscriptionService.subscribe(
      req.user.id,
      subscribeDto,
    );
    return { message: 'Subscription successfully created', data };
  }

  @Get('me')
  @UseGuards(ActiveSubscriptionGuard)
  async subscribeStatus(@Req() req: Request) {
    const data = await this.subscriptionService.mySubscribeStatus(req.user.id);
    return {
      message: 'Current active subscription fetched successfully',
      data,
    };
  }
}
