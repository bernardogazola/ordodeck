import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

import { IsNumber } from 'class-validator';

export class CreateSessionDto {
  @ApiProperty({
    description: 'O ID do usuário',
    example: 1,
  })
  @IsNumber()
  userId: number;

  @ApiProperty({
    description: 'O token de atualização',
    example: '1234567890',
  })
  @IsString()
  refresh_token: string;

  @ApiProperty({
    description: 'O IP do usuário',
    example: '123.45.67.89',
  })
  @IsString()
  ip: string;

  @ApiProperty({
    description: 'O nome do dispositivo',
    example: 'MacBook Pro',
  })
  @IsString()
  device_name: string;

  @ApiProperty({
    description: 'O sistema operacional do usuário',
    example: 'Windows 10',
  })
  @IsString()
  device_os: string;

  @ApiProperty({
    description: 'O navegador do usuário',
    example: 'Chrome',
  })
  @IsString()
  browser: string;

  @ApiProperty({
    description: 'A localização do usuário',
    example: 'Curitiba, PR',
  })
  @IsString()
  location: string;

  @ApiProperty({
    description: 'O user agent do usuário',
    example:
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
  })
  @IsString()
  userAgent: string;
}
