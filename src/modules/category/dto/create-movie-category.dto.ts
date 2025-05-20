import { IsUUID } from 'class-validator';

export class CreateMovieCategoryDto {
  @IsUUID()
  movieId: string;

  @IsUUID()
  categoryId: string;
}
