import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from '@repo/database';
import { hashString, validateString } from '@/common/utils/argon2';
import { ValidateUserDto } from './dto/validate-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async findOne(userId: number): Promise<User | null> {
    return await this.prisma.user.findUnique({
      where: {
        id: userId,
      },
    });
  }

  async findByEmail(email: string): Promise<User | null> {
    return await this.prisma.user.findUnique({
      where: {
        email,
      },
    });
  }

  async findAll(): Promise<User[]> {
    return await this.prisma.user.findMany();
  }

  // Encontra um usuário pelo identificador (email ou nome de usuário)
  async findByIdentifier(identifier: string): Promise<User | null> {
    return await this.prisma.user.findFirst({
      where: { OR: [{ email: identifier }, { username: identifier }] },
    });
  }

  async create(createUserDto: CreateUserDto): Promise<User> {
    const userData: CreateUserDto = { ...createUserDto };

    if (!userData.name) {
      userData.name = userData.email.split('@')[0]!;
    }
    if (!userData.username) {
      userData.username =
        userData.email.split('@')[0]! +
        '#' +
        Math.floor(Math.random() * 1000)
          .toString()
          .padStart(3, '0');
    }
    if (userData.password) {
      userData.password = await hashString(userData.password);
    }

    try {
      const user = this.prisma.user.create({
        data: userData,
      });
      return user;
    } catch {
      throw new BadRequestException('Ocorreu um erro ao criar o usuário.');
    }
  }

  async update(userId: number, updateUserDto: UpdateUserDto): Promise<User> {
    return await this.prisma.user.update({
      where: { id: userId },
      data: updateUserDto,
    });
  }

  // Checa se o usuário existe e valida as credenciais
  async validateUser(dto: ValidateUserDto): Promise<User> {
    const user = await this.findByIdentifier(dto.identifier);

    if (!user) throw new NotFoundException('Usuário não encontrado');

    const isValid = await validateString(dto.password, user.password);

    if (!isValid) throw new UnauthorizedException('Credenciais inválidas');

    return user;
  }
}
