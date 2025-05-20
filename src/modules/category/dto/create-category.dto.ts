import { IsString, Length, IsOptional, IsNotEmpty } from 'class-validator';

export class CreateCategoryDto {
  @IsString()
  @IsNotEmpty()
  @Length(2, 255)
  name: string;

  @IsString()
  @IsNotEmpty()
  @Length(2, 255)
  slug: string;

  @IsOptional()
  @IsString()
  description?: string;
}
