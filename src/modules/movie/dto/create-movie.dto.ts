// dto/create-movie.dto.ts - To'g'rilangan versiya

import {
  IsString,
  IsNotEmpty,
  IsArray,
  ValidateNested,
  IsNumber,
  IsUUID,
  ArrayNotEmpty,
} from 'class-validator';
import { Type, Transform } from 'class-transformer';
import { VideoQuality } from '@prisma/client';
import { MovieLanguage } from 'src/common/@types/literal.enum';

class CreateMovieFileDto {
  @IsString()
  @IsNotEmpty()
  quality: VideoQuality;

  @IsString()
  @IsNotEmpty()
  language: MovieLanguage;
}

export class CreateMovieDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  description: string;

  @Transform(({ value }) => {
    if (typeof value === 'string') {
      return parseInt(value);
    }
    return value;
  })
  @IsNumber()
  durationSecond: number;

  @Transform(({ value }) => {
    if (typeof value === 'string') {
      return parseInt(value);
    }
    return value;
  })
  @IsNumber()
  releaseYear: number;

  @ArrayNotEmpty()
  @IsUUID('all', { each: true })
  @Transform(({ value }) => {
    if (typeof value === 'string') {
      try {
        return JSON.parse(value);
      } catch (e) {
        if (value.startsWith('[') && value.endsWith(']')) {
          return JSON.parse(value);
        }
        return [value];
      }
    }
    return value;
  })
  @IsArray()
  categoryIds: string[];
}
