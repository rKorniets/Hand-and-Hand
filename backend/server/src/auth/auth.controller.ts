import {
  Body,
  Controller,
  Get,
  Post,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { Public } from './decorators/public.decorator';
import { CurrentUser } from './decorators/current-user.decorator';
import { RegisterUserDto, RegisterOrganizationDto } from './dto/register.dto';
import { LoginUserDto, LoginOrganizationDto } from './dto/login.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { VerifyEmailDto, ResendVerificationDto } from './dto/verify-email.dto';
import { RefreshTokenDto, LogoutDto } from './dto/refresh-token.dto';
import { ApiBearerAuth, ApiTags, ApiOperation } from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';

export interface AuthUser {
  id: number;
  email: string;
  role: string;
  status: string;
}

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Throttle({ default: { limit: 3, ttl: 60000 } })
  @Post('register/user')
  @ApiOperation({ summary: 'Реєстрація звичайного користувача' })
  registerUser(@Body() dto: RegisterUserDto) {
    return this.authService.registerUser(dto);
  }

  @Public()
  @Throttle({ default: { limit: 3, ttl: 60000 } })
  @Post('register/organization')
  @ApiOperation({ summary: 'Реєстрація організації' })
  registerOrganization(@Body() dto: RegisterOrganizationDto) {
    return this.authService.registerOrganization(dto);
  }

  @Public()
  @Throttle({ default: { limit: 5, ttl: 60000 } })
  @HttpCode(HttpStatus.OK)
  @Post('login/user')
  @ApiOperation({ summary: 'Логін звичайного користувача' })
  loginUser(@Body() dto: LoginUserDto) {
    return this.authService.loginUser(dto);
  }

  @Public()
  @Throttle({ default: { limit: 5, ttl: 60000 } })
  @HttpCode(HttpStatus.OK)
  @Post('login/organization')
  @ApiOperation({ summary: 'Логін організації' })
  loginOrganization(@Body() dto: LoginOrganizationDto) {
    return this.authService.loginOrganization(dto);
  }

  @Public()
  @HttpCode(HttpStatus.OK)
  @Post('verify-email')
  @ApiOperation({ summary: 'Підтвердження електронної пошти за токеном' })
  verifyEmail(@Body() dto: VerifyEmailDto) {
    return this.authService.verifyEmail(dto.userId, dto.token);
  }

  @Public()
  @Throttle({ default: { limit: 3, ttl: 300000 } }) // 3 запити на 5 хвилин
  @HttpCode(HttpStatus.OK)
  @Post('resend-verification')
  @ApiOperation({ summary: 'Повторна відправка листа для підтвердження' })
  resendVerification(@Body() dto: ResendVerificationDto) {
    return this.authService.resendVerification(dto.email);
  }

  @Public()
  @Throttle({ default: { limit: 3, ttl: 300000 } })
  @HttpCode(HttpStatus.OK)
  @Post('forgot-password')
  @ApiOperation({ summary: 'Запит на відновлення пароля' })
  forgotPassword(@Body() dto: ForgotPasswordDto) {
    return this.authService.forgotPassword(dto.email);
  }

  @Public()
  @HttpCode(HttpStatus.OK)
  @Post('reset-password')
  @ApiOperation({ summary: 'Встановлення нового пароля' })
  resetPassword(@Body() dto: ResetPasswordDto) {
    return this.authService.resetPassword(
      dto.userId,
      dto.token,
      dto.newPassword,
    );
  }

  @Public()
  @Throttle({ default: { limit: 10, ttl: 60000 } })
  @HttpCode(HttpStatus.OK)
  @Post('refresh')
  @ApiOperation({ summary: 'Оновлення access token за refresh token' })
  refresh(@Body() dto: RefreshTokenDto) {
    return this.authService.refresh(dto.refreshToken);
  }

  @Public()
  @HttpCode(HttpStatus.NO_CONTENT)
  @Post('logout')
  @ApiOperation({ summary: 'Logout — відкликає refresh token' })
  async logout(@Body() dto: LogoutDto): Promise<void> {
    await this.authService.logout(dto.refreshToken);
  }

  @ApiBearerAuth()
  @Get('me')
  @ApiOperation({ summary: 'Отримати профіль поточного користувача' })
  me(@CurrentUser() user: AuthUser) {
    return this.authService.me(user);
  }
}
