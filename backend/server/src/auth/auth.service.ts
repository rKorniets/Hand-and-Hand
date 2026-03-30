import {
  ConflictException,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as argon2 from 'argon2';
import { PrismaService } from '../prisma/prisma.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
    private config: ConfigService,
  ) {}

  async register(dto: RegisterDto) {
    const exists = await this.prisma.app_user.findUnique({
      where: { email: dto.email },
    });
    if (exists) throw new ConflictException('Email already exists');

    const passwordHash = await argon2.hash(dto.password);

    const user = await this.prisma.$transaction(async (tx) => {
      const u = await tx.app_user.create({
        data: {
          email: dto.email,
          password_hash: passwordHash,
          role: dto.role as any,
          status: 'PENDING' as any,
        },
      });

      if (dto.role === 'VOLUNTEER') {
        await tx.volunteer_profile.create({
          data: {
            user_id: u.id,
            display_name: dto.displayName,
            phone: dto.phone || '',
            bio: dto.bio || '',
          },
        });
      } else if (dto.role === 'ORGANIZATION') {
        await tx.organization_profile.create({
          data: {
            user_id: u.id,
            name: dto.displayName,
            description: dto.bio || '',
            contact_phone: dto.phone || '',
            contact_email: dto.email,
          },
        });
      } else if (dto.role === 'RECIPIENT') {
        await tx.recipient_profile.create({
          data: {
            user_id: u.id,
            name: dto.displayName,
            recipient_type: 'PERSON' as any,
            contact_info: dto.phone || dto.email,
          },
        });
      }

      return u;
    });

    return { message: 'Registered successfully', userId: user.id };
  }

  async login(dto: LoginDto) {
    const user = await this.prisma.app_user.findUnique({
      where: { email: dto.email },
    });
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isValid = await argon2.verify(user.password_hash, dto.password);
    if (!isValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    if (user.status !== 'ACTIVE') {
      throw new ForbiddenException('Account is not active');
    }

    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role,
      status: user.status,
    };

    const accessToken = await this.jwt.signAsync(payload, {
      secret: this.config.get<string>('JWT_ACCESS_SECRET'),
      expiresIn: (this.config.get<string>('ACCESS_TOKEN_TTL') || '15m') as any,
    });

    return { accessToken };
  }

  async me(user: any) {
    return this.prisma.app_user.findUnique({
      where: { id: user.sub },
      select: {
        id: true,
        email: true,
        role: true,
        status: true,
        created_at: true,
        volunteer_profile: true,
        organization_profile: true,
        recipient_profile: true,
      },
    });
  }
}
