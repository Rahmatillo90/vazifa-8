import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { TUser } from '../@types/payload';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const token: string = request.cookies['auth-token'];
    if (!token) {
      throw new UnauthorizedException('Token not exist');
    }

    try {
      request.user = await this.jwtService.verifyAsync<TUser>(token);
      return true;
    } catch (error) {
      throw new UnauthorizedException('Token is invalid');
    }
  }
}
