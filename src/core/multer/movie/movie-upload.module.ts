import { Global, Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { MovieMulterConfigService } from './movie-upload.service';

@Global()
@Module({
  imports: [MulterModule.registerAsync({ useClass: MovieMulterConfigService })],
  providers: [MovieMulterConfigService],
  exports: [MulterModule],
})
export class MovieUploadModule {}
