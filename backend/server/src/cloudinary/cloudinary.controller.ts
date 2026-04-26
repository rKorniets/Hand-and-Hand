import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiConsumes,
  ApiBody,
} from '@nestjs/swagger';
import { CloudinaryService } from './cloudinary.service';
import { Roles } from '../auth/decorators/roles.decorator';
import { user_role_enum } from '@prisma/client';

const IMAGE_UPLOAD_LIMIT_BYTES = 5 * 1024 * 1024;
const DOCUMENT_UPLOAD_LIMIT_BYTES = 10 * 1024 * 1024;

@ApiTags('Upload')
@Controller('upload')
export class CloudinaryController {
  constructor(private readonly cloudinaryService: CloudinaryService) {}

  @Post('image')
  @ApiBearerAuth()
  @Roles(
    user_role_enum.ADMIN,
    user_role_enum.ORGANIZATION,
    user_role_enum.VOLUNTEER,
    user_role_enum.APP_USER,
  )
  @ApiOperation({
    summary: 'Завантажити зображення',
    description: 'Дозволені формати: JPG, PNG. Максимальний розмір: 5MB',
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
          description: 'Файл зображення (jpg, jpeg, png)',
        },
      },
    },
  })
  @UseInterceptors(
    FileInterceptor('file', {
      limits: { fileSize: IMAGE_UPLOAD_LIMIT_BYTES },
    }),
  )
  async uploadImage(@UploadedFile() file: Express.Multer.File) {
    const url = await this.cloudinaryService.uploadImage(file);
    return { url };
  }

  @Post('document')
  @ApiBearerAuth()
  @Roles(
    user_role_enum.ADMIN,
    user_role_enum.ORGANIZATION,
    user_role_enum.VOLUNTEER,
    user_role_enum.APP_USER,
  )
  @ApiOperation({
    summary: 'Завантажити документ',
    description:
      'Дозволені формати: JPG, PNG, PDF. Максимальний розмір: 10MB. Зберігається в папці hand-and-hand/documents',
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
          description: 'Файл документа (jpg, jpeg, png, pdf)',
        },
      },
    },
  })
  @UseInterceptors(
    FileInterceptor('file', {
      limits: { fileSize: DOCUMENT_UPLOAD_LIMIT_BYTES },
    }),
  )
  async uploadDocument(@UploadedFile() file: Express.Multer.File) {
    const url = await this.cloudinaryService.uploadDocument(file);
    return { url };
  }
}
