import { SetMetadata } from '@nestjs/common';
import { AUDIT_KEY } from '../audit.constants';

export interface AuditOptions {
  entityType?: string;
  resolveEntityId?: (req: any, res: any) => number | null | undefined;
  resolvePayload?: (req: any, res: any) => Record<string, unknown> | undefined;
}

export interface AuditMetadata extends AuditOptions {
  action: string;
}

export const Audit = (action: string, options: AuditOptions = {}) =>
  SetMetadata(AUDIT_KEY, { action, ...options } satisfies AuditMetadata);
