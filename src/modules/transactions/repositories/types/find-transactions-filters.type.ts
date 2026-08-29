import { TransactionType } from '@prisma/client';

export type FindTransactionsFilters = {
  startDate?: Date;
  endDate?: Date;
  type?: TransactionType;
  accountId?: string;
  categoryId?: string;
  search?: string;
};
