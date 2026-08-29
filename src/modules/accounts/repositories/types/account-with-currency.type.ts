import { Prisma } from '@prisma/client';

export type AccountWithCurrency = Prisma.AccountGetPayload<{
  include: {
    currency: true;
  };
}>;
