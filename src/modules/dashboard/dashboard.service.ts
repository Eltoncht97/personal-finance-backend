import { Injectable } from '@nestjs/common';
import { DashboardRepository } from './repositories/interfaces/dashboard.repository';

@Injectable()
export class DashboardService {
  constructor(private readonly dashboardRepository: DashboardRepository) {}

  async getMonthlySummary(year: number, month: number, userId: string) {
    const startDate = new Date(Date.UTC(year, month - 1, 1));
    const endDate = new Date(Date.UTC(year, month, 1));

    const [totals, expensesByCategory, recentTransactions] = await Promise.all([
      this.dashboardRepository.getMonthlyTotals(userId, startDate, endDate),
      this.dashboardRepository.getExpensesByCategory(
        userId,
        startDate,
        endDate,
      ),
      this.dashboardRepository.getRecentTransactions(
        userId,
        startDate,
        endDate,
        5,
      ),
    ]);

    const net = totals.income - totals.expenses;

    const savingsRate = totals.income > 0 ? (net / totals.income) * 100 : 0;

    const categoryIds = expensesByCategory.map((item) => item.categoryId);

    const categories = await this.dashboardRepository.findCategoriesByIds(
      userId,
      categoryIds,
    );

    const categoryMap = new Map(
      categories.map((category) => [category.id, category.name]),
    );

    const expensesByCategoryResponse = expensesByCategory.map((item) => ({
      categoryId: item.categoryId,
      categoryName: categoryMap.get(item.categoryId) ?? 'Unknown',
      amount: item.amount,
      percentage:
        totals.expenses > 0 ? (item.amount / totals.expenses) * 100 : 0,
    }));

    return {
      income: totals.income,
      expenses: totals.expenses,
      net,
      savingsRate,
      expensesByCategory: expensesByCategoryResponse,
      recentTransactions,
    };
  }
}
