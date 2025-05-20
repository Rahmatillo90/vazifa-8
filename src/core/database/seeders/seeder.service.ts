import { Injectable, OnModuleInit } from '@nestjs/common';
import { DataBaseService } from '../database.service';
import { hash } from 'bcrypt';

@Injectable()
export class SeederService implements OnModuleInit {
  constructor(private readonly database: DataBaseService) {}

  async defaultSuperAdmin() {
    const username = process.env.SUPER_ADMIN_USERNAME as string;
    const email = process.env.SUPER_ADMIN_EMAIL as string;
    const pass = process.env.SUPER_ADMIN_PASSWORD as string;
    const password = await hash(pass, 12);

    return await this.database.user.upsert({
      where: { username, email },
      update: {},
      create: { username, email, password, role: 'SUPER_ADMIN' },
    });
  }

  async defaultSubscriptionPlan() {
    await this.database.subscriptionPlan.createMany({
      data: [
        {
          name: 'Free',
          price: 0,
          duration: 0,
          unit: 'DAY',
          features: ['SD sifatli kinolar', 'Reklama bilan'],
        },
        {
          name: 'Premium',
          price: 9990,
          duration: 1,
          unit: 'MONTH',
          features: ['HD sifatli kinolar', 'Reklamasiz', 'Yangi kinolar'],
        },
      ],
      skipDuplicates: true,
    });
  }

  async onModuleInit() {
    try {
      await this.defaultSuperAdmin();
      await this.defaultSubscriptionPlan();
    } catch (error) {
      console.log(error.message);
      process.exit(1);
    } finally {
      this.database.$disconnect();
    }
  }
}
