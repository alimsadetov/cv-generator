import { PrismaService } from '@database';
import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { Prisma, User } from '@prisma/client';
import { UserRepository } from 'src/modules/database/repositories/user.repository';
import { USER_NOT_EXIST } from '../exceptions/exceptions.consts';
import { UpdateUserRequestDto } from '../dto/update-user.dto';
import { AuthLoginEntity } from '../entity/login-response.entity';
import { UserEntityWithPasswordHash } from '../entity/user.entity';
import { userSelects } from '../selects';

@Injectable()
export class UserService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly prisma: PrismaService,
  ) {
    // this.addProfileForAllUsers();
  }

  //TODO: прочекать, тут берётся полный объект юзера с профилем и лимтами
  async getUserByEmailOrUsername(
    emailOrUsername: string,
  ): Promise<UserEntityWithPasswordHash> {
    const user = await this.prisma.user.findFirst({
      where: { email: emailOrUsername },
      select: {
        id: true,
        email: true,
        username: true,
        passwordHash: true,
        limit: {
          select: {
            limit: true,
            remain: true,
          },
        },
        profile: {
          select: {
            firstName: true,
            lastName: true,
          },
        },
      },
    });
    if (!user) {
      const user = await this.prisma.user.findFirst({
        where: { username: emailOrUsername },
        select: {
          ...userSelects.mainInfo,
          passwordHash: true,
        },
      });
      return user;
    }
    return user;
  }

  async getUserOrThrow(
    where: Prisma.UserWhereUniqueInput,
  ): Promise<AuthLoginEntity> {
    const user = await this.prisma.user.findUnique({
      where,
      select: userSelects.mainInfo,
    });
    if (!user) {
      throw new UnprocessableEntityException(USER_NOT_EXIST);
    }
    return user;
  }

  async createUser(data: Prisma.UserCreateInput): Promise<AuthLoginEntity> {
    await this.checkUserDuplicate(data.email);

    // todo подключить отправку почты await this.mailService.sendPasswordForNewUser(user.email, dto.password);
    return this.prisma.user.create({
      data,
      select: userSelects.mainInfo,
    });
  }

  async updateUser(
    dto: UpdateUserRequestDto,
    userId: number,
  ): Promise<AuthLoginEntity> {
    return this.prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        profile: {
          update: {
            firstName: dto.firstName,
            lastName: dto.lastName,
          },
        },
      },
      select: userSelects.mainInfo,
    });
  }

  async getUserByIp(ip: string): Promise<{ id: number }> {
    return await this.prisma.user.findFirst({
      where: { ip },
      select: { id: true },
    });
  }

  async getNotRegisteredUserByIp(ip: string): Promise<{ id: number }> {
    return await this.prisma.user.findFirst({
      where: { ip, role: 'IpGuest' },
      select: { id: true },
    });
  }

  async registerCreatedByIpUser(
    id: number,
    data: Prisma.UserUpdateInput,
  ): Promise<AuthLoginEntity> {
    await this.checkUserDuplicate(<string>data.email);
    return this.prisma.user.update({
      where: { id },
      data: { ...data, role: 'User' },
      include: { profile: true, limit: true },
    });
  }

  async createUserByIp(ip: string): Promise<{ id: number }> {
    return await this.prisma.user.create({ data: { ip, role: 'IpGuest' } });
  }

  private async checkUserDuplicate(email: string): Promise<void> {
    const existingUser = await this.prisma.user.findFirst({
      where: { email },
      select: { email: true },
    });
    if (existingUser) {
      const fieldName = existingUser.email === email ? 'email' : 'username';
      throw new UnprocessableEntityException(
        `User with such ${fieldName} already exists`,
      );
    }
  }

  private async addProfileForAllUsers() {
    const usersWOProfile = await this.prisma.user.findMany({
      where: { profile: null },
      select: { id: true },
    });
    console.log(usersWOProfile);
    for (const user of usersWOProfile) {
      await this.prisma.profile.create({ data: { userId: user.id } });
    }
  }

  // async update(params: {
  //   where: Prisma.UserWhereUniqueInput;
  //   data: Prisma.UserUncheckedUpdateInput;
  // }): Promise<User> {
  //   return this.userRep.update(params);
  // }
}
