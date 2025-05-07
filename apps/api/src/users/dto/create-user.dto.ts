import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MinLength,
  Matches,
  IsOptional,
} from 'class-validator';

export class CreateUserDto {
  @ApiProperty({
    description: 'O email do usuário',
    example: 'bernardo@exemplo.com',
  })
  @IsEmail({}, { message: 'Por favor, forneça um endereço de email válido' })
  email: string;

  @ApiProperty({
    description: 'A senha do usuário',
    example: 'Password123!',
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(8, { message: 'A senha deve conter pelo menos 8 caracteres' })
  @Matches(/[A-Z]/, {
    message: 'A senha deve conter pelo menos uma letra maiúscula',
  })
  @Matches(/[a-z]/, {
    message: 'A senha deve conter pelo menos uma letra minúscula',
  })
  @Matches(/[0-9]/, { message: 'A senha deve conter pelo menos um número' })
  password: string;

  @ApiProperty({
    description: 'O nome de usuário do usuário',
    example: 'bernardo',
  })
  @IsString({
    message: 'O nome de usuário deve ser uma string',
  })
  @IsOptional()
  username: string;

  @ApiProperty({
    description: 'O nome do usuário',
    example: 'Bernardo G',
  })
  @IsString()
  @IsOptional()
  @MinLength(2, { message: 'O nome deve conter pelo menos 2 caracteres' })
  name: string;
}
