import { IsNotEmpty, IsUUID } from 'class-validator';

export class LikeMovieDto {
  @IsNotEmpty()
  @IsUUID()
  movieId: string;
}
