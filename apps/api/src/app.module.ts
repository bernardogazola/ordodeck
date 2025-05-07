import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { PrismaService } from './prisma/prisma.service';
import { ThrottleModule } from './common/modules/throttle.module';
import { JwtModule } from '@nestjs/jwt';
import { validateEnv } from './common/utils/validateEnv';
import { ThrottlerGuard } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './common/guards/jwt-auth.guard';
import { LoggerModule } from './common/modules/logger.module';
import { HealthModule } from './health/health.module';
import { SessionModule } from './sessions/sessions.module';

@Module({
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    // {
    //   provide: APP_GUARD,
    //   useClass: RolesGuard,
    // },
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
    PrismaService,
  ],
  imports: [
    JwtModule.register({
      global: true,
    }),
    ConfigModule.forRoot({
      isGlobal: true,
      validate: validateEnv,
    }),
    LoggerModule,
    ThrottleModule,
    PrismaModule,
    UsersModule,
    AuthModule,
    HealthModule,
    SessionModule,
  ],
})
export class AppModule {}
