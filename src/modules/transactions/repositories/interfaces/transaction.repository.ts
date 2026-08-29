import { Account, Category } from '@prisma/client';
import { CreateTransactionData } from '../types/create-transaction-data.type';
import { TransactionWithRelations } from '../types/transaction-with-relations.type';
import { FindTransactionsFilters } from '../types/find-transactions-filters.type';
import { TransactionForDeletion } from '../types/transaction-for-deletion.type';

export abstract class TransactionRepository {
  abstract findAllByUserId(
    userId: string,
    filters: FindTransactionsFilters,
  ): Promise<TransactionWithRelations[]>;
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
  abstract findByIdAndUserId(
    id: string,
    userId: string,
  ): Promise<TransactionForDeletion | null>;
  abstract deleteAndReverseBalance(
    transaction: TransactionForDeletion,
  ): Promise<void>;
}
