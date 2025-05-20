import { IsString, IsInt, IsNumber, Min, Max } from 'class-validator';

export class CreateWatchHistoryDto {
  @IsString()
  userId: string;

  @IsString()
  movieId: string;

  @IsInt()
  @Min(0)
  watchedDuration: number;

  @IsNumber()
  @Min(0)
  @Max(100)
  watchedPercentage: number;
}
