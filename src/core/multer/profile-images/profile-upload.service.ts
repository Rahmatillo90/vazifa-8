import { Injectable } from '@nestjs/common';
import {
  MulterModuleOptions,
  MulterOptionsFactory,
} from '@nestjs/platform-express';
import { existsSync, mkdirSync } from 'fs';
import { diskStorage } from 'multer';
import { extname } from 'path';

@Injectable()
export class ProfileUploadService implements MulterOptionsFactory {
  createMulterOptions(): MulterModuleOptions {
    const uploadPath = `${process.cwd()}/uploads/avatars`;
    if (!existsSync(uploadPath)) mkdirSync(uploadPath, { recursive: true });

    return {
      storage: diskStorage({
        destination: uploadPath,
        filename: (req, file, cb) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          const ext = extname(file.originalname);
          cb(null, `profile-${uniqueSuffix}${ext}`);
        },
      }),
      fileFilter: (req, file, cb) => {
        const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/webp'];
        cb(null, allowedMimeTypes.includes(file.mimetype));
      },
      limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB
    };
  }
}
