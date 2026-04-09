import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class SuperAdminGuard implements CanActivate {
  constructor(private readonly prisma: PrismaService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    const adminProfile = await this.prisma.admin_profile.findUnique({
      where: { user_id: user.sub },
    });

    if (!adminProfile?.is_super_admin) {
      throw new ForbiddenException('Тільки супер-адмін має доступ');
    }

    return true;
  }
}
