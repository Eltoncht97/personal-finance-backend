import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { DashboardRepository } from '../interfaces/dashboard.repository';
import { MonthlyTotals } from '../types/monthly-totals.type';
import { ExpensesByCategory } from '../types/expenses-by-category.type';
import { CategorySummary } from '../types/category-summary.type';

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

  async getExpensesByCategory(
    userId: string,
    startDate: Date,
    endDate: Date,
  ): Promise<ExpensesByCategory> {
    const result = await this.prismaService.transaction.groupBy({
      by: ['categoryId'],
      where: {
        type: 'EXPENSE',
        account: {
          userId,
        },
        date: {
          gte: startDate,
          lt: endDate,
        },
        categoryId: {
          not: null,
        },
      },
      _sum: {
        amount: true,
      },
    });

    return result.map((item) => ({
      categoryId: item.categoryId!,
      amount: Number(item._sum.amount ?? 0),
    }));
  }

  findCategoriesByIds(
    userId: string,
    categoryIds: string[],
  ): Promise<CategorySummary[]> {
    return this.prismaService.category.findMany({
      where: {
        userId,
        id: {
          in: categoryIds,
        },
      },
      select: {
        id: true,
        name: true,
      },
    });
  }
}
