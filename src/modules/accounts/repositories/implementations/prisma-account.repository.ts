import { Account } from '@prisma/client';
import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { AccountRepository } from '../interfaces/account.repository';
import { CreateAccountData } from '../types/create-account-data.type';

@Injectable()
export class PrismaAccountRepository extends AccountRepository {
  constructor(private readonly prismaService: PrismaService) {
    super();
  }

  findAllByUserId(id: string): Promise<Account[]> {
    return this.prismaService.account.findMany({
      where: { userId: id },
    });
  }

  create(data: CreateAccountData): Promise<Account> {
    return this.prismaService.account.create({ data });
  }
}
