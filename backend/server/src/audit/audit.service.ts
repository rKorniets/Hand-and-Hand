import { Injectable, Logger } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

export interface AuditInput {
  userId?: number | null;
  action: string;
  entityType?: string | null;
  entityId?: number | null;
  payload?: Record<string, unknown>;
  ip?: string | null;
  userAgent?: string | null;
}

@Injectable()
export class AuditService {
  private readonly logger = new Logger(AuditService.name);

  constructor(private prisma: PrismaService) {}

  log(input: AuditInput): void {
    void this.prisma.audit_log
      .create({
        data: {
          user_id: input.userId ?? null,
          action: input.action,
          entity_type: input.entityType ?? null,
          entity_id: input.entityId ?? null,
          payload: (input.payload ?? undefined) as Prisma.InputJsonValue,
          ip: input.ip ?? null,
          user_agent: input.userAgent ?? null,
        },
      })
      .catch((err: unknown) => {
        this.logger.error('audit write failed', err);
      });
  }
}
