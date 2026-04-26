import {
  ConflictException,
  Injectable,
  UnauthorizedException,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as argon2 from 'argon2';
import * as crypto from 'crypto';
import * as nodemailer from 'nodemailer';
import { PrismaService } from '../prisma/prisma.service';
import { RegisterUserDto, RegisterOrganizationDto } from './dto/register.dto';
import { LoginUserDto, LoginOrganizationDto } from './dto/login.dto';
import { user_role_enum, user_status_enum } from '@prisma/client';

@Injectable()
export class AuthService {
  private readonly mailUser: string;
  private readonly mailPass: string;
  private readonly frontendUrl: string;

  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
    private config: ConfigService,
  ) {
    this.mailUser = this.config.getOrThrow<string>('MAIL_USER');
    this.mailPass = this.config.getOrThrow<string>('MAIL_PASSWORD');
    this.frontendUrl =
      this.config.get<string>('FRONTEND_URL') || 'http://localhost:4200';
  }

  async registerUser(dto: RegisterUserDto) {
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
          role: user_role_enum.VOLUNTEER,
          status: user_status_enum.ACTIVE,
          first_name: dto.firstName,
          last_name: dto.lastName,
          city: dto.city,
        },
      });

      await tx.volunteer_profile.create({
        data: {
          user_id: u.id,
          display_name: dto.email,
          phone: '',
          bio: '',
          is_verified: false,
        },
      });

      return u;
    });

    const token = await this.signToken(user);
    return { message: 'Registered successfully', ...token };
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

      await tx.approval_request.create({
        data: {
          submitted_by: u.id,
          entity_id: u.id,
          type: 'ORGANIZATION',
          status: 'PENDING',
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

    if (user.status === user_status_enum.PENDING) {
      throw new ForbiddenException(
        'Ваш акаунт очікує підтвердження адміністратором',
      );
    }
    if (user.status === user_status_enum.INACTIVE) {
      throw new ForbiddenException('Ваш акаунт було відхилено');
    }

    if (user.status !== user_status_enum.ACTIVE) {
      throw new ForbiddenException('Акаунт організації не активний');
    }

    return this.signToken(user);
  }

  async forgotPassword(email: string) {
    const user = await this.prisma.app_user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new NotFoundException('Користувача з такою поштою не знайдено');
    }

    const resetToken = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 1);

    await this.prisma.$transaction(async (tx) => {
      await tx.password_reset_token.deleteMany({
        where: { user_id: user.id },
      });

      await tx.password_reset_token.create({
        data: {
          user_id: user.id,
          token: resetToken,
          expires_at: expiresAt,
        },
      });
    });

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: this.mailUser,
        pass: this.mailPass,
      },
    });

    const resetLink = `${this.frontendUrl}/reset-password?token=${resetToken}&id=${user.id}`;

    await transporter.sendMail({
      from: `"Hand-and-Hand" <${this.mailUser}>`,
      to: user.email,
      subject: 'Відновлення пароля',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto;">
          <h2>Привіт!</h2>
          <p>Ви надіслали запит на скидання пароля у системі Hand-and-Hand.</p>
          <p>Перейдіть за посиланням нижче, щоб встановити новий пароль:</p>
          <a href="${resetLink}" style="display: inline-block; padding: 10px 20px; color: white; background-color: #007bff; text-decoration: none; border-radius: 5px;">Скинути пароль</a>
          <p><em>Посилання дійсне протягом 1 години.</em></p>
          <p>Якщо ви цього не робили, просто проігноруйте цей лист. Ваш пароль залишиться незмінним.</p>
        </div>
      `,
    });

    return { message: 'Лист для відновлення пароля успішно надіслано' };
  }

  async resetPassword(userId: number, token: string, newPassword: string) {
    const resetToken = await this.prisma.password_reset_token.findUnique({
      where: { token },
    });

    if (!resetToken || resetToken.user_id !== userId) {
      throw new UnauthorizedException('Недійсний токен відновлення');
    }

    const now = new Date();
    if (resetToken.expires_at < now) {
      await this.prisma.password_reset_token.delete({
        where: { id: resetToken.id },
      });
      throw new UnauthorizedException('Термін дії токена вичерпано');
    }

    const passwordHash = await argon2.hash(newPassword);

    await this.prisma.$transaction(async (tx) => {
      await tx.app_user.update({
        where: { id: userId },
        data: { password_hash: passwordHash },
      });

      await tx.password_reset_token.delete({
        where: { id: resetToken.id },
      });
    });

    return { message: 'Пароль успішно змінено' };
  }

  private async signToken(user: {
    id: number;
    email: string;
    role: user_role_enum;
    status: user_status_enum;
  }) {
    const payload: Record<string, any> = {
      sub: user.id,
      email: user.email,
      role: String(user.role),
      status: String(user.status),
    };

    if (user.role === user_role_enum.ORGANIZATION) {
      const orgProfile = await this.prisma.organization_profile.findUnique({
        where: { user_id: user.id },
        select: { id: true },
      });
      if (orgProfile) {
        payload.organization_profile_id = orgProfile.id;
      }
    }

    const secret = this.config.getOrThrow<string>('JWT_ACCESS_SECRET');
    const ttl = this.config.get<string>('ACCESS_TOKEN_TTL') || '15m';

    // @ts-expect-error: Ігноруємо баг типізації перевантажених методів у бібліотеці JwtService
    const accessToken = await this.jwt.signAsync(payload, {
      secret,
      expiresIn: ttl,
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
