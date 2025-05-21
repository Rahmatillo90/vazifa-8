import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import { ROLES_KEY } from '../decorator/role.decorator';

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(private reflector: Reflector) {}
  canActivate(context: ExecutionContext): boolean | Promise<boolean> {
    const rolesArray = this.reflector.get<string[]>(
      ROLES_KEY,
      context.getHandler(),
    );
    if (!rolesArray) return true;

    const request = context.switchToHttp().getRequest<Request>();
    const user = request.user;

    if (!user || !rolesArray.includes(user.role))
      throw new ForbiddenException(
        'You do not have permission to access this resource',
      );
    return true;
  }
}
