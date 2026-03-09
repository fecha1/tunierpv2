import { Controller, Post, Body, UseGuards, HttpCode, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from '../../shared/guards/jwt-auth.guard';
import { Auth } from '../../shared/decorators';
import type { AuthContext } from '@tunierp/auth';
import { IsEmail, IsString, MinLength, IsOptional, IsIn } from 'class-validator';
import { ThrottlerGuard, Throttle } from '@nestjs/throttler';

// ── DTOs ─────────────────────────────────────────────────

class LoginDto {
  @IsEmail({}, { message: 'Email invalide' })
  email!: string;

  @IsString()
  @MinLength(6, { message: 'Mot de passe: 6 caractères minimum' })
  password!: string;
}

class RegisterDto {
  @IsString()
  tenantName!: string;

  @IsString()
  @IsIn(['retail', 'restaurant', 'cafe', 'bakery', 'pharmacy', 'clothing', 'electronics', 'grocery', 'beauty', 'auto_parts', 'building_materials', 'furniture', 'jewelry', 'optics', 'general'])
  businessType!: string;

  @IsString()
  @IsIn(['starter', 'business', 'professional', 'enterprise'])
  planCode!: string;

  @IsEmail({}, { message: 'Email invalide' })
  email!: string;

  @IsString()
  @MinLength(6, { message: 'Mot de passe: 6 caractères minimum' })
  password!: string;

  @IsString()
  firstName!: string;

  @IsString()
  lastName!: string;

  @IsOptional()
  @IsString()
  phone?: string;
}

class RefreshTokenDto {
  @IsString()
  refreshToken!: string;
}

// ── Controller ───────────────────────────────────────────

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @UseGuards(ThrottlerGuard)
  @Throttle({ default: { ttl: 60000, limit: 5 } })
  @HttpCode(HttpStatus.OK)
  async login(@Body() dto: LoginDto) {
    return this.authService.login(dto.email, dto.password);
  }

  @Post('register')
  @UseGuards(ThrottlerGuard)
  @Throttle({ default: { ttl: 60000, limit: 3 } })
  async register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  @Post('refresh')
  @UseGuards(ThrottlerGuard)
  @Throttle({ default: { ttl: 60000, limit: 10 } })
  @HttpCode(HttpStatus.OK)
  async refresh(@Body() dto: RefreshTokenDto) {
    return this.authService.refreshTokens(dto.refreshToken);
  }

  @Post('logout')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  async logout(@Auth() auth: AuthContext) {
    await this.authService.logout(auth.userId);
    return { message: 'Déconnexion réussie' };
  }

  @Post('me')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  async me(@Auth() auth: AuthContext) {
    return auth;
  }
}
