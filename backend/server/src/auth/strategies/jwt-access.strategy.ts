import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PrismaService } from '../../prisma/prisma.service';
import { user_role_enum, user_status_enum } from '@prisma/client';

export interface JwtPayload {
  sub: number;
  email: string;
  role: user_role_enum;
  status: user_status_enum;
}

@Injectable()
export class JwtAccessStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    config: ConfigService,
    private prisma: PrismaService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: config.get<string>('JWT_ACCESS_SECRET')!,
      ignoreExpiration: false,
    });
  }

  async validate(payload: JwtPayload) {
    let organizationId: number | null = null;

    if (payload.role === 'ORGANIZATION') {
      const orgProfile = await this.prisma.organization_profile.findUnique({
        where: { user_id: payload.sub },
        select: { id: true },
      });
      organizationId = orgProfile?.id ?? null;
    }

    return {
      id: payload.sub,
      email: payload.email,
      role: payload.role,
      status: payload.status,
      organizationId,
    };
  }
}
