import { Injectable } from '@nestjs/common';
import { DashboardRepository } from './repositories/interfaces/dashboard.repository';

@Injectable()
export class DashboardService {
  constructor(private readonly dashboardRepository: DashboardRepository) {}

  async getMonthlySummary(year: number, month: number, userId: string) {
    const startDate = new Date(Date.UTC(year, month - 1, 1));
    const endDate = new Date(Date.UTC(year, month, 1));

    const totals = await this.dashboardRepository.getMonthlyTotals(
      userId,
      startDate,
      endDate,
    );

    const net = totals.income - totals.expenses;

    const savingsRate = totals.income > 0 ? (net / totals.income) * 100 : 0;

    return {
      income: totals.income,
      expenses: totals.expenses,
      net,
      savingsRate,
    };
  }
}
