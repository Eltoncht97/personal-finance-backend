import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateBudgetDto } from './dto/create-budget.dto';
import { UpdateBudgetDto } from './dto/update-budget.dto';
import { BudgetsRepository } from './repositories/interfaces/budgets.repository';

@Injectable()
export class BudgetsService {
  constructor(private readonly budgetsRepository: BudgetsRepository) {}

  async findMonthly(year: number, month: number, userId: string) {
    const budgets = await this.budgetsRepository.findMonthlyBudgets(
      userId,
      year,
      month,
    );
    const categoryIds = budgets.map((budget) => budget.categoryId);
    const startDate = new Date(Date.UTC(year, month - 1, 1));
    const endDate = new Date(Date.UTC(year, month, 1));
    const expenses =
      categoryIds.length > 0
        ? await this.budgetsRepository.aggregateExpensesByCategory(
            userId,
            categoryIds,
            startDate,
            endDate,
          )
        : [];
    const spentMap = new Map(
      expenses.map((expense) => [expense.categoryId, expense.amount]),
    );

    return budgets.map((budget) => {
      const amount = Number(budget.amount);
      const spent = spentMap.get(budget.categoryId) ?? 0;

      return {
        id: budget.id,
        categoryId: budget.categoryId,
        categoryName: budget.category.name,
        amount,
        spent,
        remaining: amount - spent,
        percentageUsed: amount > 0 ? (spent / amount) * 100 : 0,
      };
    });
  }

  async create(dto: CreateBudgetDto, userId: string) {
    const category = await this.budgetsRepository.findCategoryByIdAndUserId(
      dto.categoryId,
      userId,
    );

    if (!category) {
      throw new NotFoundException('Category not found');
    }

    if (category.type !== 'EXPENSE') {
      throw new BadRequestException(
        'Budgets can only be created for expense categories',
      );
    }

    const existingBudget = await this.budgetsRepository.findExistingBudget({
      categoryId: dto.categoryId,
      year: dto.year,
      month: dto.month,
      userId,
    });

    if (existingBudget) {
      throw new ConflictException(
        'A budget already exists for this category and month',
      );
    }

    const budget = await this.budgetsRepository.create({ ...dto, userId });

    return {
      id: budget.id,
      categoryId: budget.categoryId,
      amount: Number(budget.amount),
      year: budget.year,
      month: budget.month,
    };
  }

  async update(id: string, dto: UpdateBudgetDto, userId: string) {
    const budget = await this.budgetsRepository.findByIdAndUserId(id, userId);

    if (!budget) {
      throw new NotFoundException('Budget not found');
    }

    const updatedBudget = await this.budgetsRepository.updateAmount(
      id,
      dto.amount,
    );

    return {
      id: updatedBudget.id,
      categoryId: updatedBudget.categoryId,
      amount: Number(updatedBudget.amount),
      year: updatedBudget.year,
      month: updatedBudget.month,
    };
  }
}
