import { Prisma } from '@prisma/client';
import { PrismaService } from '../services/prisma.service';
import { NotFoundException } from '@nestjs/common';

export class UserRepository {
  constructor(private readonly prisma: PrismaService) {}

  async getById(id: number, select?: Prisma.UserSelect) {
    return this.prisma.user.findUnique({ where: { id }, select });
  }

  async getFirst(where: Prisma.UserWhereInput, select?: Prisma.UserSelect) {
    return this.prisma.user.findFirst({ where, select });
  }

  async getFirstOrThrowError(
    where: Prisma.UserWhereInput,
    select?: Prisma.UserSelect,
  ) {
    const user = await this.getFirst(where, select);
    if (!user) {
      throw new NotFoundException('Пользователь не найден.');
    }
  }

  async create(data: Prisma.UserCreateInput, select?: Prisma.UserSelect) {
    return this.prisma.user.create({ data, select });
  }
}
