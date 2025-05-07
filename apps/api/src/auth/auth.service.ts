import {
  Injectable,
  UnauthorizedException,
  ConflictException,
  Logger,
  Inject,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService, ConfigType } from '@nestjs/config';
import { UsersService } from '../users/users.service';

import { PrismaService } from '../prisma/prisma.service';
import { Env } from '@/common/utils/validateEnv';
import { Session, User } from '@repo/database';
import { CreateUserDto } from '@/users/dto/create-user.dto';
import AuthTokensInterface from './interfaces/auth-tokens.interface';
import { hashString } from '@/common/utils/argon2';
import RegisterUserInterface from './interfaces/register-user.interface';
import { SignInUserDto } from './dto/signIn-user.dto';
import LoginUserInterface from './interfaces/login-user.interface';
import { SignOutUserDto } from './dto/signOut-user.dto';
import { SignOutAllDeviceUserDto } from './dto/signOutAllDevice-user.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import RefreshTokenInterface from './interfaces/refresh-token.interface';
import { ChangePasswordDto } from './dto/change-password.dto';
import { SessionService } from '@/sessions/sessions.service';

// Applying GoF Pattern: Facade
// Reason: To simplify complex authentication operations (register, login, token management) into a cohesive interface
// Refs: This entire service is a Facade for authentication operations

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService,
    private readonly sessionService: SessionService,
    private readonly config: ConfigService<Env>,
  ) {}

  // Gerar access e refresh tokens
  async generateTokens(user: User): Promise<AuthTokensInterface> {
    const [access_token, refresh_token] = await Promise.all([
      this.jwtService.signAsync(
        {
          sub: user.id,
          username: user.username,
        },
        {
          secret: this.config.get('ACCESS_TOKEN_SECRET'),
          expiresIn: this.config.get('ACCESS_TOKEN_EXPIRATION'),
        },
      ),
      this.jwtService.signAsync(
        {
          sub: user.id,
          username: user.username,
        },
        {
          secret: this.config.get('REFRESH_TOKEN_SECRET'),
          expiresIn: this.config.get('REFRESH_TOKEN_EXPIRATION'),
        },
      ),
    ]);

    return {
      access_token,
      refresh_token,
    };
  }

  // Registrar conta de usuário
  async register(createUserDto: CreateUserDto): Promise<RegisterUserInterface> {
    const user = await this.usersService.create(createUserDto);
    return { data: user };
  }

  // SignIn na conta de usuário
  async signIn(dto: SignInUserDto): Promise<LoginUserInterface> {
    const user = await this.usersService.validateUser(dto);
    const tokens = await this.generateTokens(user);
    const session = await this.sessionService.create({
      userId: user.id,
      refresh_token: tokens.refresh_token,
      ip: dto.ip,
      device_name: dto.device_name,
      device_os: dto.device_os,
      browser: dto.browser,
      location: dto.location,
      userAgent: dto.userAgent,
    });
    return { data: user, tokens: { ...tokens, session_token: session.id } };
  }

  // Sair da conta de usuário
  async signOut(dto: SignOutUserDto): Promise<void> {
    const session = await this.sessionService.findOne(dto.session_token);

    if (!session) throw new NotFoundException('Sessão não encontrada');
    await this.sessionService.delete(dto.session_token);
  }

  // Sair de todas as contas de usuário
  async signOutAllDevices(dto: SignOutAllDeviceUserDto): Promise<void> {
    await this.sessionService.deleteMany(dto.userId);
  }

  // Atualizar o refresh token do usuário
  async refreshToken(dto: RefreshTokenDto): Promise<RefreshTokenInterface> {
    const user = await this.usersService.findOne(dto.user_id);

    if (!user) throw new NotFoundException('Usuário não encontrado');

    const { access_token, refresh_token } = await this.generateTokens(user);

    const session = await this.sessionService.findByTokenAndUserId(
      dto.session_token,
      dto.user_id,
    );

    if (!session) throw new NotFoundException('Sessão não encontrada');

    await this.sessionService.update(session.id, { refresh_token });

    return {
      access_token,
      refresh_token,
    };
  }

  // Alterar senha
  async changePassword(dto: ChangePasswordDto): Promise<void> {
    const user = await this.usersService.validateUser(dto);
    user.password = await hashString(dto.newPassword);
    await this.usersService.update(user.id, { password: user.password });
  }
}
