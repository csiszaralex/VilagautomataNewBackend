import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { genSalt, hash } from 'bcrypt';
import { PrismaService } from 'nestjs-prisma';
import { CreateUserDto } from './dto/CreateUser.dto';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: number): Promise<User> {
    console.log(id);

    return this.prisma.user.findUnique({ where: { id } });
  }
  async findByAuthSchId(internal_id: string): Promise<User> {
    return this.prisma.user.findUnique({ where: { authSchId: internal_id } });
  }
  async createUser(user: CreateUserDto): Promise<User> {
    const salt = await genSalt();
    return this.prisma.user.create({ data: { ...user, salt } });
  }
  async update(userId: number, user: Partial<User>): Promise<User> {
    return this.prisma.user.update({ where: { id: userId }, data: user });
  }
  async updateRtHash(userId: number, salt: string, rt: string): Promise<void> {
    if (salt === '') {
      await this.prisma.user.updateMany({
        where: { id: userId, rtHash: { not: null } },
        data: { rtHash: null },
      });
      return;
    }
    const rtHash = await hash(rt, salt);
    await this.prisma.user.update({ where: { id: userId }, data: { rtHash } });
  }
}
