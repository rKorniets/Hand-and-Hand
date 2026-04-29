import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

interface RequestUser {
  id: number;
}

@Injectable()
export class SuperAdminGuard implements CanActivate {
  constructor(private readonly prisma: PrismaService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<{ user: RequestUser }>();
    const user = request.user;
    if (!user || !user.id) {
      throw new ForbiddenException('Access denied');
    }

    const adminProfile = await this.prisma.admin_profile.findUnique({
      where: { user_id: user.id },
    });

    if (!adminProfile?.is_super_admin) {
      throw new ForbiddenException('Access denied');
    }

    return true;
  }
}
