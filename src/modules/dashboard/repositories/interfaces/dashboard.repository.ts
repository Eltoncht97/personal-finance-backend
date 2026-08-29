import { CategorySummary } from '../types/category-summary.type';
import { ExpensesByCategory } from '../types/expenses-by-category.type';
import { MonthlyTotals } from '../types/monthly-totals.type';
import { RecentTransaction } from '../types/recent-transaction.type';

export abstract class DashboardRepository {
  abstract getMonthlyTotals(
    userId: string,
    startDate: Date,
    endDate: Date,
  ): Promise<MonthlyTotals>;

  abstract getExpensesByCategory(
    userId: string,
    startDate: Date,
    endDate: Date,
  ): Promise<ExpensesByCategory>;

  abstract findCategoriesByIds(
    userId: string,
    categoryIds: string[],
  ): Promise<CategorySummary[]>;

  abstract getRecentTransactions(
    userId: string,
    startDate: Date,
    endDate: Date,
    limit: number,
  ): Promise<RecentTransaction[]>;
}
