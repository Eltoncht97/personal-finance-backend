import { Prisma } from '@prisma/client';

export type TransactionWithRelations = Prisma.TransactionGetPayload<{
  include: {
    account: {
      include: {
        currency: true;
      };
    };
    category: true;
  };
}>;
