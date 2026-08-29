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
      const { initialBalance, ...accountData } = data;

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

      const account = await tx.account.create({
        data:
          initialBalance && initialBalance > 0
            ? { ...accountData, balance: initialBalance }
            : accountData,
        include: { currency: true },
      });

      if (initialBalance && initialBalance > 0) {
        await tx.transaction.create({
          data: {
            type: 'OPENING_BALANCE',
            amount: initialBalance,
            description: 'Opening balance',
            date: new Date(),
            accountId: account.id,
            categoryId: null,
          },
        });
      }

      return account;
    });
  }
}
