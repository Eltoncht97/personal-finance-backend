import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { DashboardRepository } from '../interfaces/dashboard.repository';
import { MonthlyTotals } from '../types/monthly-totals.type';

@Injectable()
export class PrismaDashboardRepository extends DashboardRepository {
  constructor(private readonly prismaService: PrismaService) {
    super();
  }

  async getMonthlyTotals(
    userId: string,
    startDate: Date,
    endDate: Date,
  ): Promise<MonthlyTotals> {
    const [incomeResult, expensesResult] = await Promise.all([
      this.prismaService.transaction.aggregate({
        where: {
          type: 'INCOME',
          account: {
            userId,
          },
          date: {
            gte: startDate,
            lt: endDate,
          },
        },
        _sum: {
          amount: true,
        },
      }),
      this.prismaService.transaction.aggregate({
        where: {
          type: 'EXPENSE',
          account: {
            userId,
          },
          date: {
            gte: startDate,
            lt: endDate,
          },
        },
        _sum: {
          amount: true,
        },
      }),
    ]);

    return {
      income: Number(incomeResult._sum.amount ?? 0),
      expenses: Number(expensesResult._sum.amount ?? 0),
    };
  }
}
