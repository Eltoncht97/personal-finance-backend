import { Budget, Category } from '@prisma/client';
import { BudgetWithCategory } from '../types/budget-with-category.type';
import { CreateBudgetData } from '../types/create-budget-data.type';
import { ExpenseByCategory } from '../types/expense-by-category.type';
import { FindExistingBudgetData } from '../types/find-existing-budget-data.type';

export abstract class BudgetsRepository {
  abstract findCategoryByIdAndUserId(
    id: string,
    userId: string,
  ): Promise<Category | null>;
  abstract findByIdAndUserId(
    id: string,
    userId: string,
  ): Promise<Budget | null>;
  abstract findExistingBudget(
    data: FindExistingBudgetData,
  ): Promise<Budget | null>;
  abstract create(data: CreateBudgetData): Promise<Budget>;
  abstract updateAmount(id: string, amount: number): Promise<Budget>;
  abstract findMonthlyBudgets(
    userId: string,
    year: number,
    month: number,
  ): Promise<BudgetWithCategory[]>;
  abstract aggregateExpensesByCategory(
    userId: string,
    categoryIds: string[],
    startDate: Date,
    endDate: Date,
  ): Promise<ExpenseByCategory[]>;
}
