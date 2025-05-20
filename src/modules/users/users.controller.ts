import {
  Controller,
  Get,
  Body,
  Put,
  UseGuards,
  Req,
  Post,
  UseInterceptors,
  HttpCode,
  HttpStatus,
  UploadedFile,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { RoleGuard } from 'src/common/guards/role.guard';
import { Roles } from 'src/common/decorator/role.decorator';
import { ActiveSubscriptionGuard } from 'src/common/guards/active-subscription.guard';
import { Request } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';
import { ProfileUploadService } from 'src/core/multer/profile-images/profile-upload.service';

const profileMulter: ProfileUploadService = new ProfileUploadService();

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Put('profile')
  @UseGuards(AuthGuard, RoleGuard)
  @Roles('USER')
  async updateProfile(@Req() req: Request, @Body() updateDto: UpdateUserDto) {
    const data = await this.usersService.updateProfile(req.user.id, updateDto);
    return { message: 'Profile updated successfully', data };
  }

  @Get('watch-history')
  @UseGuards(AuthGuard, RoleGuard, ActiveSubscriptionGuard)
  @Roles('USER')
  async getHistory(@Req() req: Request) {
    const data = await this.usersService.getHistory(req.user.id);
    return { data };
  }

  @Post('upload-profile-img')
  @UseGuards(AuthGuard, RoleGuard)
  @UseInterceptors(FileInterceptor('image'))
  @HttpCode(HttpStatus.OK)
  @Roles('USER')
  async uploadProfileImage(
    @UploadedFile() file: Express.Multer.File,
    @Req() req: Request,
  ) {
    console.log(file);
    const { avatarUrl } = await this.usersService.uploadImage(
      req.user.id,
      file,
    );
    return {
      message: 'Profile image uploaded successfully',
      data: { avatarUrl },
    };
  }
}
