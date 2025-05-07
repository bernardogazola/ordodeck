import { Controller, Get, Param } from '@nestjs/common';
import { SessionService } from './sessions.service';

@Controller('sessions')
export class SessionsController {
  constructor(private readonly sessionService: SessionService) {}

  @Get(':userId')
  async sessions(@Param('userId') userId: number) {
    const data = await this.sessionService.findMany(userId);
    return {
      data,
    };
  }

  @Get(':id')
  async session(@Param('id') id: string) {
    const data = await this.sessionService.findOne(id);
    return {
      data,
    };
  }
}
