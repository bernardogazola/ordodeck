import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateSessionDto } from './dto/create-session.dto';
import { UpdateSessionDto } from './dto/update-session.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Session } from '@repo/database';
@Injectable()
export class SessionService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createSessionDto: CreateSessionDto) {
    try {
      return await this.prisma.session.create({
        data: createSessionDto,
      });
    } catch (error) {
      throw new BadRequestException('Erro ao criar sessão');
    }
  }

  async findAll() {
    return await this.prisma.session.findMany();
  }

  async findMany(userId: number): Promise<Session[]> {
    return await this.prisma.session.findMany({
      where: { userId },
    });
  }

  async findOne(id: string): Promise<Session> {
    const session = await this.prisma.session.findUnique({
      where: { id },
    });

    if (!session) throw new NotFoundException('Sessão não encontrada!');

    return session;
  }

  async findByTokenAndUserId(token: string, userId: number) {
    return await this.prisma.session.findUnique({
      where: { id: token, userId },
    });
  }

  async update(id: string, updateSessionDto: UpdateSessionDto) {
    return await this.prisma.session.update({
      where: { id },
      data: updateSessionDto,
    });
  }

  async delete(id: string) {
    return await this.prisma.session.delete({
      where: { id },
    });
  }

  async deleteMany(userId: number) {
    return await this.prisma.session.deleteMany({
      where: { userId },
    });
  }
}
