import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
  Req,
} from '@nestjs/common';
import { FavoriteService } from './favorite.service';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { RoleGuard } from 'src/common/guards/role.guard';
import { Roles } from 'src/common/decorator/role.decorator';
import { ActiveSubscriptionGuard } from 'src/common/guards/active-subscription.guard';
import { Request } from 'express';
import { IsUUID } from 'class-validator';
import { LikeMovieDto } from './dto/favorite.dto';

@Controller('favorites')
@UseGuards(AuthGuard, RoleGuard)
@Roles('USER')
export class FavoriteController {
  constructor(private readonly favoriteService: FavoriteService) {}

  @Post()
  @UseGuards(ActiveSubscriptionGuard)
  async like(@Req() req: Request, @Body() likeDto: LikeMovieDto) {
    const data = await this.favoriteService.like(req.user.id, likeDto);
    return { data };
  }

  @Get()
  @UseGuards(ActiveSubscriptionGuard)
  async likes(@Req() req: Request) {
    const data = await this.favoriteService.likes(req.user.id);
    return { data };
  }

  @Delete(':id')
  async dislike(@Param() id: string) {
    await this.favoriteService.dislike(id);
    return { message: 'Movie deleted successfully from your favorites' };
  }
}
