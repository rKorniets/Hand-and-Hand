import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable, tap } from 'rxjs';
import { AUDIT_KEY } from './audit.constants';
import { AuditMetadata } from './decorators/audit.decorator';
import { AuditService } from './audit.service';

@Injectable()
export class AuditInterceptor implements NestInterceptor {
  constructor(
    private readonly reflector: Reflector,
    private readonly audit: AuditService,
  ) {}

  intercept(ctx: ExecutionContext, next: CallHandler): Observable<unknown> {
    const meta = this.reflector.getAllAndOverride<AuditMetadata | undefined>(
      AUDIT_KEY,
      [ctx.getHandler(), ctx.getClass()],
    );
    if (!meta) return next.handle();

    const req = ctx.switchToHttp().getRequest();

    return next.handle().pipe(
      tap((res: unknown) => {
        const entityId = meta.resolveEntityId
          ? meta.resolveEntityId(req, res)
          : req.params?.id != null
            ? Number(req.params.id)
            : null;

        const payload = meta.resolvePayload?.(req, res);

        this.audit.log({
          userId: req.user?.id ?? null,
          action: meta.action,
          entityType: meta.entityType ?? null,
          entityId: Number.isFinite(entityId as number)
            ? (entityId as number)
            : null,
          payload,
          ip: req.ip,
          userAgent: req.headers?.['user-agent'],
        });
      }),
    );
  }
}
