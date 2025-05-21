import { Module } from '@nestjs/common';
import { MovieService } from './movie.service';
import { MovieController } from './movie.controller';
import { MovieUploadModule } from 'src/core/multer/movie/movie-upload.module';

@Module({
  imports: [MovieUploadModule],
  controllers: [MovieController],
  providers: [MovieService],
})
export class MovieModule {}
