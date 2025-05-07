import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersService } from 'src/users/users.service';
import { SessionService } from '@/sessions/sessions.service';

@Module({
  controllers: [AuthController],
  providers: [AuthService, UsersService, SessionService],
})
export class AuthModule {}
