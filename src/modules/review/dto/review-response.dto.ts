export class ReviewResponseDto {
  id: string;
  userId: string;
  movieId: string;
  rating: number;
  comment?: string;
  createdAt: Date;
}
