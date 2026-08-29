import { Prisma } from '@prisma/client';

export type TransferAccount = Prisma.AccountGetPayload<{
  include: { currency: true };
}>;
