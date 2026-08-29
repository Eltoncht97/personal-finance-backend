import { Injectable } from '@nestjs/common';
import { Budget, Category } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { BudgetsRepository } from '../interfaces/budgets.repository';
import { BudgetWithCategory } from '../types/budget-with-category.type';
import { CreateBudgetData } from '../types/create-budget-data.type';
import { ExpenseByCategory } from '../types/expense-by-category.type';
import { FindExistingBudgetData } from '../types/find-existing-budget-data.type';

@Injectable()
export class PrismaBudgetsRepository extends BudgetsRepository {
  constructor(private readonly prismaService: PrismaService) {
    super();
  }

  findCategoryByIdAndUserId(
    id: string,
    userId: string,
  ): Promise<Category | null> {
    return this.prismaService.category.findFirst({ where: { id, userId } });
  }

  findByIdAndUserId(id: string, userId: string): Promise<Budget | null> {
    return this.prismaService.budget.findFirst({ where: { id, userId } });
  }

  findExistingBudget(data: FindExistingBudgetData): Promise<Budget | null> {
    return this.prismaService.budget.findUnique({
      where: {
        userId_categoryId_year_month: data,
      },
    });
  }

  create(data: CreateBudgetData): Promise<Budget> {
    return this.prismaService.budget.create({ data });
  }

  updateAmount(id: string, amount: number): Promise<Budget> {
    return this.prismaService.budget.update({
      where: { id },
      data: { amount },
    });
  }

  findMonthlyBudgets(
    userId: string,
    year: number,
    month: number,
  ): Promise<BudgetWithCategory[]> {
    return this.prismaService.budget.findMany({
      where: { userId, year, month },
      include: { category: true },
    });
  }

  async aggregateExpensesByCategory(
    userId: string,
    categoryIds: string[],
    startDate: Date,
    endDate: Date,
  ): Promise<ExpenseByCategory[]> {
    const expenses = await this.prismaService.transaction.groupBy({
      by: ['categoryId'],
      where: {
        type: 'EXPENSE',
        categoryId: { in: categoryIds },
        account: { userId },
        date: {
          gte: startDate,
          lt: endDate,
        },
      },
      _sum: { amount: true },
    });

    return expenses.map((expense) => ({
      categoryId: expense.categoryId!,
      amount: Number(expense._sum.amount ?? 0),
    }));
  }
}
