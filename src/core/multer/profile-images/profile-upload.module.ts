// core/multer/profile/profile-upload.module.ts

import { Global, Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { ProfileUploadService } from './profile-upload.service';

@Global()
@Module({
  imports: [MulterModule.registerAsync({ useClass: ProfileUploadService })],
  providers: [ProfileUploadService],
  exports: [MulterModule],
})
export class ProfileUploadModule {}
