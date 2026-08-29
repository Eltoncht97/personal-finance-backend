import { Prisma } from '@prisma/client';

export type BudgetWithCategory = Prisma.BudgetGetPayload<{
  include: { category: true };
}>;
