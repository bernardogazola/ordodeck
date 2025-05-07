import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';

export class SignOutAllDeviceUserDto {
  @ApiProperty()
  @IsNumber()
  userId: number;
}
