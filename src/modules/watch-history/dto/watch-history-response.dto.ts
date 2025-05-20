export class WatchHistoryResponseDto {
  id: string;
  userId: string;
  movieId: string;
  watchedDuration: number;
  watchedPercentage: number;
  lastWatched: Date;
}
