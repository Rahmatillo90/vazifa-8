import {
  Controller,
  Post,
  Body,
  Req,
  UseGuards,
  Delete,
  Param,
} from '@nestjs/common';
import { WatchHistoryService } from './watch-history.service';
import { CreateWatchHistoryDto } from './dto/create-watch-history.dto';
import { Request } from 'express';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { RoleGuard } from 'src/common/guards/role.guard';
import { ActiveSubscriptionGuard } from 'src/common/guards/active-subscription.guard';
import { Roles } from 'src/common/decorator/role.decorator';

@Controller('watch-history')
@UseGuards(AuthGuard, RoleGuard)
@Roles('USER')
export class WatchHistoryController {
  constructor(private readonly watchHistoryService: WatchHistoryService) {}

  @Post()
  @UseGuards(ActiveSubscriptionGuard)
  async create(
    @Body() createWatchHistoryDto: CreateWatchHistoryDto,
    @Req() req: Request,
  ) {
    const data = await this.watchHistoryService.save(
      req.user.id,
      createWatchHistoryDto,
    );
    return { message: 'Movie added watch-history', data };
  }

  @Delete()
  async clearing(@Req() req: Request) {
    const data = await this.watchHistoryService.clearWatchHistory(req.user.id);
    return { message: `Watch History cleaned!`, data };
  }

  @Delete(':id')
  async deleteOne(@Req() req: Request, @Param('id') id: string) {
    await this.watchHistoryService.deleteOneHistory(id, req.user.id);
    return { message: 'One History deleted successfully from WatchHistory' };
  }
}
