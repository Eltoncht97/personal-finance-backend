import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { AccountRepository } from '../interfaces/account.repository';
import { CreateAccountData } from '../types/create-account-data.type';
import { AccountWithCurrency } from '../types/account-with-currency.type';

@Injectable()
export class PrismaAccountRepository extends AccountRepository {
  constructor(private readonly prismaService: PrismaService) {
    super();
  }

  findAllByUserId(userId: string): Promise<AccountWithCurrency[]> {
    return this.prismaService.account.findMany({
      where: { userId },
      include: { currency: true },
    });
  }

  async create(data: CreateAccountData): Promise<AccountWithCurrency> {
    return this.prismaService.$transaction(async (tx) => {
      if (data.isDefault) {
        await tx.account.updateMany({
          where: {
            userId: data.userId,
            isDefault: true,
          },
          data: {
            isDefault: false,
          },
        });
      }

      return tx.account.create({
        data,
        include: { currency: true },
      });
    });
  }
}
