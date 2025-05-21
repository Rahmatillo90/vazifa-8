import { Injectable } from '@nestjs/common';
import { DataBaseService } from 'src/core/database/database.service';
import { CreateWatchHistoryDto } from './dto/create-watch-history.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class WatchHistoryService {
  constructor(private readonly prisma: DataBaseService) {}

  async save(userId: string, dto: CreateWatchHistoryDto) {
    const existing = await this.prisma.watchHistory.findFirst({
      where: { userId, movieId: dto.movieId },
    });

    if (existing) {
      return await this.prisma.watchHistory.update({
        where: { id: existing.id },
        data: {
          watchedDuration: dto.watchedDuration,
          watchedPercentage: dto.watchedPercentage,
          lastWatched: new Date(),
        },
        select: {
          id: true,
          userId: true,
          movie: { select: { title: true, posterUrl: true } },
          watchedDuration: true,
          watchedPercentage: true,
          lastWatched: true,
        },
      });
    }

    return await this.prisma.watchHistory.create({
      data: {
        userId,
        movieId: dto.movieId,
        watchedDuration: dto.watchedDuration,
        watchedPercentage: dto.watchedPercentage,
      },
      select: {
        id: true,
        userId: true,
        movie: { select: { title: true, posterUrl: true } },
        watchedDuration: true,
        watchedPercentage: true,
        lastWatched: true,
      },
    });
  }

  async clearWatchHistory(userId: string) {
    const history = await this.prisma.watchHistory.deleteMany({
      where: { userId },
    });
    return history.count;
  }

  async deleteOneHistory(id: string, userId: string) {
    await this.prisma.watchHistory.delete({
      where: { id, userId },
    });
  }
}
