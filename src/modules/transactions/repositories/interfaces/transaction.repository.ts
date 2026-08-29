import { Account, Category } from '@prisma/client';
import { CreateTransactionData } from '../types/create-transaction-data.type';
import { TransactionWithRelations } from '../types/transaction-with-relations.type';

export abstract class TransactionRepository {
  abstract findAllByUserId(userId: string): Promise<TransactionWithRelations[]>;
  abstract findAccountByIdAndUserId(
    id: string,
    userId: string,
  ): Promise<Account | null>;
  abstract findCategoryByIdAndUserId(
    id: string,
    userId: string,
  ): Promise<Category | null>;
  abstract create(
    data: CreateTransactionData,
  ): Promise<TransactionWithRelations>;
}
