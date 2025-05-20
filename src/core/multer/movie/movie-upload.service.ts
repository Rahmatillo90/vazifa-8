import { BadRequestException, Injectable } from '@nestjs/common';
import {
  MulterOptionsFactory,
  MulterModuleOptions,
} from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import * as fs from 'fs';

@Injectable()
export class MovieMulterConfigService implements MulterOptionsFactory {
  createMulterOptions(): MulterModuleOptions {
    return {
      storage: diskStorage({
        destination: (req, file, cb) => {
          let uploadPath: string;

          if (file.fieldname === 'poster') {
            uploadPath = `${process.cwd()}/uploads/posters`;
          } else if (file.fieldname === 'videoFiles') {
            uploadPath = `${process.cwd()}/uploads/movies`;
          } else {
            return cb(new BadRequestException('Invalid field name'), '');
          }

          if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath, { recursive: true });
          }

          cb(null, uploadPath);
        },
        filename: (req, file, cb) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          const ext = extname(file.originalname);
          const prefix = file.fieldname === 'poster' ? 'poster' : 'movie';
          cb(null, `${prefix}-${uniqueSuffix}${ext}`);
        },
      }),
      fileFilter: (req, file, cb) => {
        const isPoster = file.fieldname === 'poster';
        const isVideo = file.fieldname === 'videoFiles';

        const imageMimeTypes = ['image/jpeg', 'image/png', 'image/webp'];
        const videoMimeTypes = [
          'video/mp4',
          'video/x-matroska',
          'video/x-msvideo',
          'video/quicktime',
          'video/x-ms-wmv',
          'video/x-flv',
          'video/webm',
        ];

        if (isPoster && imageMimeTypes.includes(file.mimetype)) {
          return cb(null, true);
        }

        if (isVideo && videoMimeTypes.includes(file.mimetype)) {
          return cb(null, true);
        }

        return cb(new Error('Invalid file type'), false);
      },
      limits: {
        fileSize: 1024 * 1024 * 1024, // 1GB
      },
    };
  }
}
