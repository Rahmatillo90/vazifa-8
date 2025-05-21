import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { Request, Response } from 'express';
import { LoginDto } from './dto/login.dto';
import { AuthGuard } from 'src/common/guards/auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('sign-up')
  async sign_up(@Body() registerDto: RegisterDto) {
    const user = await this.authService.register(registerDto);
    return { message: 'You have successfully registered.', data: user };
  }

  @Post('login')
  async sign_in(
    @Body() loginDto: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { token, user } = await this.authService.login(loginDto);
    res.cookie('auth-token', token, { httpOnly: true });
    return { message: 'You have successfully logged in.', data: user };
  }

  @Post('logout')
  @UseGuards(AuthGuard)
  async logout(@Res({ passthrough: true }) res: Response) {
    res.clearCookie('auth-token');
    return { message: 'You have successfully logged out.' };
  }

  @Get('profile')
  @UseGuards(AuthGuard)
  async getMe(@Req() req: Request) {
    const data = await this.authService.getProfile(req.user.id);
    return { data };
  }
}
