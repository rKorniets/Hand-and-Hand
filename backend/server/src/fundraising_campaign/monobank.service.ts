import {
  Injectable,
  BadRequestException,
  InternalServerErrorException,
  HttpException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class MonobankService {
  constructor(private readonly configService: ConfigService) {}

  private get webhookUrl(): string {
    const url = this.configService.get<string>('MONO_WEBHOOK_URL');

    if (!url) {
      throw new InternalServerErrorException(
        'MONO_WEBHOOK_URL is not configured',
      );
    }

    return url;
  }

  validateMonoData(jarLink?: string, monoToken?: string) {
    if (!jarLink || !monoToken) {
      throw new BadRequestException('jar_link and mono_token are required');
    }
  }

  extractSendId(jarLink: string): string {
    const sendId = jarLink.split('/').pop();

    if (!sendId) {
      throw new BadRequestException('Invalid jar link');
    }

    return sendId;
  }

  async fetchClientInfo(monoToken: string): Promise<any> {
    try {
      const response = await fetch(
        'https://api.monobank.ua/personal/client-info',
        {
          headers: {
            'X-Token': monoToken,
          },
        },
      );

      if (!response.ok) {
        throw new BadRequestException(
          'Invalid Monobank token or Monobank is unavailable',
        );
      }

      return await response.json();
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }

      throw new InternalServerErrorException(
        'Failed to fetch data from Monobank',
      );
    }
  }

  findJarBySendId(clientInfo: any, sendId: string) {
    const jar = clientInfo.jars?.find((j: any) => j.sendId === `jar/${sendId}`);

    if (!jar) {
      throw new BadRequestException(
        'Jar not found. Check jar_link or mono_token',
      );
    }

    return jar;
  }

  async setWebhook(monoToken: string): Promise<void> {
    try {
      const response = await fetch('https://api.monobank.ua/personal/webhook', {
        method: 'POST',
        headers: {
          'X-Token': monoToken,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ webHookUrl: this.webhookUrl }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new BadRequestException(
          `Monobank rejected webhook: ${errorText}`,
        );
      }
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }

      throw new InternalServerErrorException('Failed to connect to Monobank');
    }
  }
}
