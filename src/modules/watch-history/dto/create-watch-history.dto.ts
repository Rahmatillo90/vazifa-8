import { IsString, IsInt, IsNumber, Min, Max, IsUUID } from 'class-validator';

export class CreateWatchHistoryDto {
  @IsString()
  @IsUUID()
  movieId: string;

  @IsInt()
  @Min(0)
  watchedDuration: number;

  @IsNumber()
  @Min(0)
  @Max(100)
  watchedPercentage: number;
}
