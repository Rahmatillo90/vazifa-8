import { HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { DataBaseService } from 'src/core/database/database.service';

@Injectable()
export class UsersService {
  constructor(private readonly database: DataBaseService) {}

  async updateProfile(id: string, updateDto: UpdateUserDto) {
    try {
      return await this.database.user.update({
        where: { id },
        data: updateDto,
        select: {
          id: true,
          fullName: true,
          phone: true,
          country: true,
          updatedAt: true,
        },
      });
    } catch (error) {
      throw new HttpException('Internal server error', 500);
    }
  }

  async getHistory(userId: string) {
    try {
      return await this.database.watchHistory.findFirst({
        where: { userId },
        orderBy: { lastWatched: 'desc' },
        include: {
          movie: {
            select: {
              title: true,
              posterUrl: true,
              durationSecond: true,
              rating: true,
              subscriptionType: true,
              viewCount: true,
              categories: true,
              createdAt: true,
            },
          },
        },
      });
    } catch (error) {
      throw new HttpException('Internal server error', 500);
    }
  }

  async uploadImage(id: string, file: Express.Multer.File) {
    try {
      if (!file) throw new NotFoundException('No file uploaded');
      const avatarUrl = `/uploads/avatars/${file.filename}`;

      await this.database.user.update({ where: { id }, data: { avatarUrl } });

      return { avatarUrl };
    } catch (error) {
      throw new HttpException(error.message, 500);
    }
  }
}
