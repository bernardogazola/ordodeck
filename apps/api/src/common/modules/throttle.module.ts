import { Module } from '@nestjs/common';
import { ThrottlerModule } from '@nestjs/throttler';

@Module({
  imports: [
    ThrottlerModule.forRoot({
      throttlers: [
        {
          name: 'short',
          ttl: 1000, // 1 sec
          limit: 2,
        },
        {
          name: 'medium',
          ttl: 10000, // 10 sec
          limit: 4,
        },
        {
          name: 'long',
          ttl: 60000, // 1 min
          limit: 10,
        },
      ],
      errorMessage: 'Muitos requests, por favor tente novamente mais tarde.',
    }),
  ],
})
export class ThrottleModule {}
