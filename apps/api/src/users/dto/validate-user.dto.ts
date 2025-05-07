import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class ValidateUserDto {
  @ApiProperty()
  @IsString({
    message: 'O identificador (email ou nome de usuário) deve ser uma string',
  })
  identifier: string;

  @ApiProperty()
  @IsString({
    message: 'A senha deve ser uma string',
  })
  password: string;
}
