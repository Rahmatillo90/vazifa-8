import {
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { DataBaseService } from 'src/core/database/database.service';
import { RegisterDto } from './dto/register.dto';
import { compare, hash } from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { TUser } from 'src/common/@types/payload';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly database: DataBaseService,
    private readonly jwtService: JwtService,
  ) {}

  async register(registerDto: RegisterDto) {
    const { username, email, password: pass } = registerDto;

    const data = await this.database.user.findFirst({
      where: { OR: [{ username }, { email }] },
    });

    if (data)
      throw new ForbiddenException(
        `User with this ${username} or ${email} already exist!`,
      );

    const password = await hash(pass, 12);
    const user = await this.database.user.create({
      data: { username, email, password, role: 'USER' },
      omit: { password: true },
    });

    return {
      id: user.id,
      username,
      role: user.role,
      createdAt: user.createdAt,
    };
  }

  async login(loginDto: LoginDto) {
    const { email, password: pass } = loginDto;
    const isExist = await this.database.user.findUnique({ where: { email } });
    if (!isExist)
      throw new UnauthorizedException(`Email or Password incorrect`);

    const isValid = await compare(pass, isExist.password);
    if (!isValid)
      throw new UnauthorizedException(`Email or Password incorrect`);

    const payload: TUser = { id: isExist.id, email, role: isExist.role };
    const token: string = await this.jwtService.signAsync(payload);

    const { id, username, role, createdAt } = isExist;
    return { token, user: { id, username, role, createdAt } };
  }

  async getProfile(id: string) {
    const user = await this.database.user.findUnique({ where: { id } });
    if (user) {
      const { id, fullName, phone, country, createdAt, avatarUrl } = user;
      return { id, fullName, phone, country, createdAt, avatarUrl };
    }
    throw new NotFoundException(`Profile not found`);
  }
}
