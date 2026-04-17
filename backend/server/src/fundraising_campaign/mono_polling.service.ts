import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { QueueServiceClient } from '@azure/storage-queue';
import { ConfigService } from '@nestjs/config';
import { FundraisingCampaignService } from './fundraising_campaign.service';

@Injectable()
export class MonoPollingService implements OnModuleInit {
  private readonly logger = new Logger(MonoPollingService.name);
  private queueClient: ReturnType<QueueServiceClient['getQueueClient']>;

  constructor(
    private fundraisingService: FundraisingCampaignService,
    private configService: ConfigService,
  ) {
    const connectionString = process.env.AZURE_STORAGE_CONNECTION_STRING;

    if (!connectionString) {
      console.warn(
        'AZURE_STORAGE_CONNECTION_STRING is not set. Mono polling disabled.',
      );
      return;
    }

    this.queueClient =
      QueueServiceClient.fromConnectionString(connectionString).getQueueClient(
        'mono-donations',
      );
  }

  onModuleInit() {
    const enabled =
      this.configService.get<string>('ENABLE_MONO_POLLING') === 'true';

    if (!enabled) {
      this.logger.log('Mono polling is disabled');
      return;
    }

    this.logger.log('Mono polling started');
    void this.processMessages();
    this.startPolling();
  }

  private async startPolling() {
    while (true) {
      await this.processMessages();
      await this.sleep(30000);
    }
  }

  private sleep(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  private async processMessages() {
    try {
      const response = await this.queueClient.receiveMessages({
        numberOfMessages: 10,
      });

      for (const message of response.receivedMessageItems) {
        const decoded = Buffer.from(message.messageText, 'base64').toString(
          'utf-8',
        );

        const data = JSON.parse(decoded) as {
          jarId: string;
          amount: number;
          balance: number;
        };

        const campaign = await this.fundraisingService.findByJarId(data.jarId);

        if (campaign) {
          await this.fundraisingService.updateBalance(
            campaign.id,
            (data.balance / 100).toFixed(2),
          );

          this.logger.log(
            `Оброблено донат: ${data.jarId}, ${Math.abs(data.amount) / 100} грн`,
          );
        }

        await this.queueClient.deleteMessage(
          message.messageId,
          message.popReceipt,
        );
      }
    } catch (error) {
      this.logger.error('Polling error:', error);
    }
  }
}
