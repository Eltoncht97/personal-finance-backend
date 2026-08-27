import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { UserRepository } from '../interfaces/user.repository';
import { CreateUserData } from '../types/create-user-data.type';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class PrismaUserRepository extends UserRepository {
  constructor(private readonly prisma: PrismaService) {
    super();
  }

  findByEmail(email: string): Promise<User | null> {
    return this.prisma.user.findUnique({ where: { email } });
  }

  create(data: CreateUserData): Promise<User> {
    return this.prisma.user.create({ data });
  }
}
