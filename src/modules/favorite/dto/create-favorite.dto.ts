import { IsUUID } from 'class-validator';

export class CreateFavoriteDto {
  @IsUUID()
  userId: string;

  @IsUUID()
  movieId: string;
}
