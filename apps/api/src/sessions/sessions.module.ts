import { Module } from '@nestjs/common';
import { SessionService } from './sessions.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { SessionsController } from './sessions.controller';

@Module({
  providers: [SessionService, PrismaService],
  exports: [SessionService],
  controllers: [SessionsController],
})
export class SessionModule {}
