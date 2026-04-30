import { Injectable, BadRequestException } from '@nestjs/common';
import { v2 as cloudinary, UploadApiResponse } from 'cloudinary';

const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/jpg', 'image/png'];
const MAX_FILE_SIZE = 5 * 1024 * 1024;

const ALLOWED_DOCUMENT_MIME_TYPES = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'application/pdf',
];
const MAX_DOCUMENT_SIZE = 10 * 1024 * 1024;
export enum ImageType {
  NEWS = 'news',
  FUNDRAISING = 'fundraising',
  PROJECT = 'project',
  ORG_LOGO = 'org_logo',
  AVATAR = 'avatar',
}
@Injectable()
export class CloudinaryService {
  constructor() {
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });
  }

  private validate(file: Express.Multer.File): void {
    if (!file) throw new BadRequestException('Файл не було завантажено');
    if (!ALLOWED_MIME_TYPES.includes(file.mimetype)) {
      throw new BadRequestException(
        'Дозволені лише зображення форматів: JPEG, PNG, JPG',
      );
    }
    if (file.size > MAX_FILE_SIZE) {
      throw new BadRequestException('Розмір файлу не повинен перевищувати 5MB');
    }
  }

  private upload(
    file: Express.Multer.File,
    transformation: Record<string, string | number>[],
  ): Promise<string> {
    return new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { folder: 'hand-and-hand', transformation, moderation: 'webpurify' },
        (error, result: UploadApiResponse) => {
          if (error) return reject(new Error(error.message));
          resolve(result.secure_url);
        },
      );
      stream.end(file.buffer);
    });
  }
  async uploadDocument(file: Express.Multer.File): Promise<string> {
    if (!file) {
      throw new BadRequestException('Файл не було завантажено');
    }
    if (!ALLOWED_DOCUMENT_MIME_TYPES.includes(file.mimetype)) {
      throw new BadRequestException(
        'Дозволені лише формати: JPEG, PNG, JPG, PDF',
      );
    }
    if (file.size > MAX_DOCUMENT_SIZE) {
      throw new BadRequestException(
        'Розмір файлу не повинен перевищувати 10MB',
      );
    }
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: 'hand-and-hand/documents',
          resource_type: 'auto',
        },
        (error, result: UploadApiResponse) => {
          if (error) return reject(new Error(error.message));
          resolve(result.secure_url);
        },
      );

      uploadStream.end(file.buffer);
    });
  }
  async uploadAvatar(file: Express.Multer.File): Promise<string> {
    this.validate(file);
    return this.upload(file, [
      { width: 300, height: 300, crop: 'fill', gravity: 'face' },
      { quality: 'auto', fetch_format: 'auto' },
    ]);
  }
  async uploadOrgLogo(file: Express.Multer.File): Promise<string> {
    this.validate(file);
    return this.upload(file, [
      { width: 400, height: 400, crop: 'fill', gravity: 'center' },
      { quality: 'auto', fetch_format: 'auto' },
    ]);
  }
  async uploadNewsImage(file: Express.Multer.File): Promise<string> {
    this.validate(file);
    return this.upload(file, [
      { width: 1200, height: 630, crop: 'fill', gravity: 'center' },
      { quality: 'auto', fetch_format: 'auto' },
    ]);
  }
  async uploadFundraisingImage(file: Express.Multer.File): Promise<string> {
    this.validate(file);
    return this.upload(file, [
      { width: 1200, height: 675, crop: 'fill', gravity: 'center' },
      { quality: 'auto', fetch_format: 'auto' },
    ]);
  }
  async uploadProjectImage(file: Express.Multer.File): Promise<string> {
    this.validate(file);
    return this.upload(file, [
      { width: 1200, height: 800, crop: 'fill', gravity: 'center' },
      { quality: 'auto', fetch_format: 'auto' },
    ]);
  }
  async replaceImage(
    file: Express.Multer.File,
    type: ImageType,
    oldUrl?: string | null,
  ): Promise<string> {
    let image_url: string;

    switch (type) {
      case ImageType.NEWS:
        image_url = await this.uploadNewsImage(file);
        break;
      case ImageType.FUNDRAISING:
        image_url = await this.uploadFundraisingImage(file);
        break;
      case ImageType.PROJECT:
        image_url = await this.uploadProjectImage(file);
        break;
      case ImageType.ORG_LOGO:
        image_url = await this.uploadOrgLogo(file);
        break;
      case ImageType.AVATAR:
        image_url = await this.uploadAvatar(file);
        break;
    }

    if (oldUrl) await this.deleteImage(oldUrl);

    return image_url;
  }
  async deleteImage(url: string): Promise<void> {
    if (!url) return;
    try {
      const match = url.match(/\/upload\/(?:v\d+\/)?(.+)\.[^.]+$/);
      if (!match?.[1]) throw new Error('Не вдалося витягнути public_id з URL');
      await cloudinary.uploader.destroy(match[1]);
    } catch (error) {
      console.error(
        'Cloudinary Deletion Error:',
        error instanceof Error ? error.message : 'Unknown error',
      );
    }
  }
}
