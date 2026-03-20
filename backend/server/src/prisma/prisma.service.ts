import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import * as path from 'path';
import * as dotenv from 'dotenv';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  constructor() {
    const envPath = path.resolve(process.cwd(), '../../.env');
    dotenv.config({ path: envPath });

    const databaseUrl = process.env.DATABASE_URL;
    if (!databaseUrl) {
      throw new Error(
        'DATABASE_URL is not set. Check your .env file path and value.',
      );
    }

    const adapter = new PrismaPg({ connectionString: databaseUrl });

    super({ adapter });
  }

  async onModuleInit() {
    await this.$connect();
  }
}
