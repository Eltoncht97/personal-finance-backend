import { ExpensesByCategory } from '../types/expenses-by-category.type';
import { MonthlyTotals } from '../types/monthly-totals.type';

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
}
