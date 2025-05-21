import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class LoginDto {
  @IsNotEmpty({ message: 'Email should not be empty' })
  @IsEmail({}, { message: 'Invalid email address' })
  email: string;

  @IsNotEmpty({ message: 'Password should not be empty' })
  @IsString({ message: 'Password must be a string' })
  password: string;
}
