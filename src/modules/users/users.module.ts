import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { ProfileUploadModule } from 'src/core/multer/profile-images/profile-upload.module';

@Module({
  imports: [ProfileUploadModule],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
