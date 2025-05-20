import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  Req,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { MovieService } from './movie.service';
import { CreateMovieDto } from './dto/create-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { RoleGuard } from 'src/common/guards/role.guard';
import { ActiveSubscriptionGuard } from 'src/common/guards/active-subscription.guard';
import { Roles } from 'src/common/decorator/role.decorator';
import { MovieQueryDto } from './dto/query.dto';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { Request } from 'express';

@Controller('movies')
@UseGuards(AuthGuard, RoleGuard)
export class MovieController {
  constructor(private readonly movieService: MovieService) {}

  @Get()
  @UseGuards(ActiveSubscriptionGuard)
  @Roles('USER')
  async movies(@Query() query: MovieQueryDto) {
    const data = await this.movieService.allMovies(query);
    return { data };
  }

  @Get(':slug')
  @UseGuards(ActiveSubscriptionGuard)
  @Roles('USER')
  async movieById(@Param('slug') slug: string) {
    const movie = await this.movieService.movieById(slug);
    const data = movie ? movie : {};
    return { data };
  }

  @Roles('ADMIN')
  @Post('upload')
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'poster', maxCount: 1 },
      { name: 'videoFiles', maxCount: 5 },
    ]),
  )
  async uploadMovie(
    @UploadedFiles()
    files: {
      poster?: Express.Multer.File[];
      videoFiles?: Express.Multer.File[];
    },
    @Body() movieDto: CreateMovieDto,
    @Req() req: Request,
  ) {
    console.log(movieDto);

    const data = await this.movieService.addMovie(req.user.id, movieDto, files);
    return { data };
  }
}
