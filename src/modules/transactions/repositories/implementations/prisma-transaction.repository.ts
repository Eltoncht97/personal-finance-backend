import { Injectable } from '@nestjs/common';
import { Account, Category } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { TransactionRepository } from '../interfaces/transaction.repository';
import { CreateTransactionData } from '../types/create-transaction-data.type';
import { TransactionWithRelations } from '../types/transaction-with-relations.type';
import { FindTransactionsFilters } from '../types/find-transactions-filters.type';

@Injectable()
export class PrismaTransactionRepository extends TransactionRepository {
  constructor(private readonly prismaService: PrismaService) {
    super();
  }

  findAllByUserId(
    userId: string,
    filters: FindTransactionsFilters,
  ): Promise<TransactionWithRelations[]> {
    return this.prismaService.transaction.findMany({
      where: {
        account: { userId },
        ...(filters.type && { type: filters.type }),
        ...(filters.accountId && { accountId: filters.accountId }),
        ...(filters.categoryId && { categoryId: filters.categoryId }),
        ...(filters.startDate &&
          filters.endDate && {
            date: {
              gte: filters.startDate,
              lt: filters.endDate,
            },
          }),
        ...(filters.search && {
          description: {
            contains: filters.search,
            mode: 'insensitive' as const,
          },
        }),
      },
      orderBy: { date: 'desc' },
      include: {
        account: { include: { currency: true } },
        category: true,
      },
    });
  }

  findAccountByIdAndUserId(
    id: string,
    userId: string,
  ): Promise<Account | null> {
    return this.prismaService.account.findFirst({ where: { id, userId } });
  }

  findCategoryByIdAndUserId(
    id: string,
    userId: string,
  ): Promise<Category | null> {
    return this.prismaService.category.findFirst({ where: { id, userId } });
  }

  create(data: CreateTransactionData): Promise<TransactionWithRelations> {
    return this.prismaService.$transaction(async (tx) => {
      const transaction = await tx.transaction.create({
        data,
        include: {
          account: { include: { currency: true } },
          category: true,
        },
      });

      await tx.account.update({
        where: { id: data.accountId },
        data: {
          balance:
            data.type === 'INCOME'
              ? { increment: data.amount }
              : { decrement: data.amount },
        },
      });

      return transaction;
    });
  }
}
