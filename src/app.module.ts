import { Module } from '@nestjs/common';
import { CoreModule } from './core/core.module';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UsersModule } from './modules/users/users.module';
import { AuthModule } from './modules/auth/auth.module';
import { SubscriptionModule } from './modules/subscription/subscription.module';
import { MovieModule } from './modules/movie/movie.module';
import { CategoryModule } from './modules/category/category.module';
import { FavoriteModule } from './modules/favorite/favorite.module';
import { ReviewModule } from './modules/review/review.module';
import { WatchHistoryModule } from './modules/watch-history/watch-history.module';
import { AdminsModule } from './modules/admins/admins.module';
import { SuperAdminsModule } from './modules/super-admins/super-admins.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: '.env' }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      global: true,
      inject: [ConfigService],
      useFactory: async (config: ConfigService) => ({
        secret: config.get('JWT_SECRET'),
        signOptions: { expiresIn: config.get('JWT_EXPIRES_IN', '1m') },
      }),
    }),
    CoreModule,
    UsersModule,
    AuthModule,
    SubscriptionModule,
    MovieModule,
    CategoryModule,
    FavoriteModule,
    ReviewModule,
    WatchHistoryModule,
    AdminsModule,
    SuperAdminsModule,
  ],
})
export class AppModule {}
