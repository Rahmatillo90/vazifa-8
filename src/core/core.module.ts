import { Global, Module } from '@nestjs/common';
import { DataBaseModule } from './database/database.module';
import { MovieUploadModule } from './multer/movie/movie-upload.module';
import { ProfileUploadModule } from './multer/profile-images/profile-upload.module';

@Global()
@Module({
  imports: [DataBaseModule, MovieUploadModule, ProfileUploadModule],
})
export class CoreModule {}
