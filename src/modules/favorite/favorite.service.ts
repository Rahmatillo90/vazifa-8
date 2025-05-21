import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { DataBaseService } from 'src/core/database/database.service';
import { LikeMovieDto } from './dto/favorite.dto';

@Injectable()
export class FavoriteService {
  constructor(private readonly database: DataBaseService) {}

  async like(userId: string, likeDto: LikeMovieDto) {
    const { movieId } = likeDto;
    const isExist = await this.database.favorite.findFirst({
      where: { userId, movieId },
    });
    if (isExist)
      throw new ConflictException(`This movie is already in your favorites`);

    try {
      const { id, movie, createdAt } = await this.database.favorite.create({
        data: { userId, movieId },
        select: {
          id: true,
          movie: { select: { title: true, id: true } },
          createdAt: true,
        },
      });
      return { id, movie_id: movie.id, movie_title: movie.title, createdAt };
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async likes(userId: string) {
    const favorite = await this.database.favorite.findMany({
      where: { userId },
      select: {
        movie: {
          select: {
            id: true,
            title: true,
            slug: true,
            posterUrl: true,
            releaseYear: true,
            rating: true,
            subscriptionType: true,
          },
        },
      },
    });
    if (favorite.length > 0)
      return {
        movies: favorite.map(({ movie }) => {
          return movie;
        }),
        total: favorite.length,
      };
    throw new NotFoundException(`My favorite movie is not exist!`);
  }

  async dislike(id: string) {
    const isExist = await this.database.favorite.findUnique({ where: { id } });
    if (!isExist)
      throw new NotFoundException(`This movie is not exist in your favorites`);

    try {
      const favorite = await this.database.favorite.delete({ where: { id } });
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }
}
