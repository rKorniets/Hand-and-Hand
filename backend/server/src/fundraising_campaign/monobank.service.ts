import {
  Injectable,
  BadRequestException,
  InternalServerErrorException,
  HttpException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

interface MonoJar {
  id: string;
  sendId: string;
  title: string;
  description?: string;
  balance: number;
}

interface MonoClientInfo {
  jars: MonoJar[];
}

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

  private validateMonoData(jarLink?: string, monoToken?: string) {
    if (!jarLink || !monoToken) {
      throw new BadRequestException('jar_link and mono_token are required');
    }
  }

  private extractSendId(jarLink: string): string {
    const sendId = jarLink.split('/').pop();

    if (!sendId) {
      throw new BadRequestException('Invalid jar link');
    }

    return sendId;
  }

  async fetchClientInfo(monoToken: string): Promise<MonoClientInfo> {
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

      const data: unknown = await response.json();
      if (typeof data !== 'object' || data === null || !('jars' in data)) {
        throw new InternalServerErrorException('Invalid Monobank response');
      }

      return data as MonoClientInfo;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }

      throw new InternalServerErrorException(
        'Failed to fetch data from Monobank',
      );
    }
  }

  private findJarBySendId(clientInfo: MonoClientInfo, sendId: string): MonoJar {
    const jar = clientInfo.jars.find((j) => j.sendId === `jar/${sendId}`);

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
  async prepareJarData(jarLink: string, monoToken: string): Promise<MonoJar> {
    this.validateMonoData(jarLink, monoToken);

    const sendId = this.extractSendId(jarLink);
    const clientInfo = await this.fetchClientInfo(monoToken);
    const jar = this.findJarBySendId(clientInfo, sendId);

    await this.setWebhook(monoToken);

    return jar;
  }
}
