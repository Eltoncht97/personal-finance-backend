import { Prisma, TransactionType } from '@prisma/client';

export type TransactionForDeletion = {
  id: string;
  type: TransactionType;
  amount: Prisma.Decimal;
  date: Date;
  accountId: string;
};
