import {
  ConflictException,
  Injectable,
  UnauthorizedException,
  ForbiddenException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as argon2 from 'argon2';
import { PrismaService } from '../prisma/prisma.service';
import { RegisterUserDto, RegisterOrganizationDto } from './dto/register.dto';
import { LoginUserDto, LoginOrganizationDto } from './dto/login.dto';
import { user_role_enum, user_status_enum } from '@prisma/client';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
    private config: ConfigService,
  ) {}

  async registerUser(dto: RegisterUserDto) {
    const exists = await this.prisma.app_user.findUnique({
      where: { email: dto.email },
    });
    if (exists) throw new ConflictException('Email already exists');

    const passwordHash = await argon2.hash(dto.password);

    const user = await this.prisma.app_user.create({
      data: {
        email: dto.email,
        password_hash: passwordHash,
        role: user_role_enum.APP_USER,
        status: user_status_enum.ACTIVE,
        first_name: dto.firstName,
        last_name: dto.lastName,
        city: dto.city,
      },
    });

    return { message: 'Registered successfully', userId: user.id };
  }

  async registerOrganization(dto: RegisterOrganizationDto) {
    const emailExists = await this.prisma.app_user.findUnique({
      where: { email: dto.email },
    });
    if (emailExists) throw new ConflictException('Email already exists');

    const edrpouExists = await this.prisma.organization_profile.findUnique({
      where: { edrpou: dto.edrpou },
    });
    if (edrpouExists) throw new ConflictException('ЄДРПОУ already registered');

    const passwordHash = await argon2.hash(dto.password);

    const user = await this.prisma.$transaction(async (tx) => {
      const u = await tx.app_user.create({
        data: {
          email: dto.email,
          password_hash: passwordHash,
          role: user_role_enum.ORGANIZATION,
          status: user_status_enum.PENDING,
        },
      });

      await tx.organization_profile.create({
        data: {
          user_id: u.id,
          name: dto.name,
          edrpou: dto.edrpou,
          contact_email: dto.email,
          mission: '',
        },
      });

      return u;
    });

    return { message: 'Registered successfully', userId: user.id };
  }

  async loginUser(dto: LoginUserDto) {
    const user = await this.prisma.app_user.findUnique({
      where: { email: dto.email },
    });

    if (!user || user.role === user_role_enum.ORGANIZATION) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isValid = await argon2.verify(user.password_hash, dto.password);
    if (!isValid) throw new UnauthorizedException('Invalid credentials');

    if (user.status !== user_status_enum.ACTIVE) {
      throw new ForbiddenException('Account is not active');
    }

    return this.signToken(user);
  }

  async loginOrganization(dto: LoginOrganizationDto) {
    const orgProfile = await this.prisma.organization_profile.findUnique({
      where: { edrpou: dto.edrpou },
      include: { app_user: true },
    });

    if (!orgProfile || !orgProfile.app_user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const user = orgProfile.app_user;

    const isValid = await argon2.verify(user.password_hash, dto.password);
    if (!isValid) throw new UnauthorizedException('Invalid credentials');

    if (user.status !== user_status_enum.ACTIVE) {
      throw new ForbiddenException('Organization account is not active');
    }

    return this.signToken(user);
  }

  private async signToken(user: {
    id: number;
    email: string;
    role: user_role_enum;
    status: user_status_enum;
  }) {
    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role,
      status: user.status,
    };

    const secret = this.config.get<string>('JWT_ACCESS_SECRET');
    const ttl = this.config.get<string>('ACCESS_TOKEN_TTL') || '15m';

    const accessToken = await this.jwt.signAsync(payload, {
      secret,
      expiresIn: ttl as any,
    });

    return { accessToken };
  }

  async me(user: { id: number }) {
    return this.prisma.app_user.findUnique({
      where: { id: user.id },
      select: {
        id: true,
        email: true,
        role: true,
        status: true,
        first_name: true,
        last_name: true,
        city: true,
        created_at: true,
        volunteer_profile: true,
        organization_profile: true,
      },
    });
  }
}
