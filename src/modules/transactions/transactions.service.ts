import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { TransactionRepository } from './repositories/interfaces/transaction.repository';
import { TransactionWithRelations } from './repositories/types/transaction-with-relations.type';
import { TransactionsQueryDto } from './dto/transactions-query.dto';
import { FindTransactionsFilters } from './repositories/types/find-transactions-filters.type';

@Injectable()
export class TransactionsService {
  constructor(private readonly repository: TransactionRepository) {}

  async findAll(query: TransactionsQueryDto, userId: string) {
    const hasYear = query.year !== undefined;
    const hasMonth = query.month !== undefined;

    if (hasYear !== hasMonth) {
      throw new BadRequestException('Year and month must be provided together');
    }

    const filters: FindTransactionsFilters = {
      type: query.type,
      accountId: query.accountId,
      categoryId: query.categoryId,
      search: query.search,
    };

    if (query.year !== undefined && query.month !== undefined) {
      filters.startDate = new Date(Date.UTC(query.year, query.month - 1, 1));
      filters.endDate = new Date(Date.UTC(query.year, query.month, 1));
    }

    const transactions = await this.repository.findAllByUserId(userId, filters);

    return transactions.map((transaction) => this.toResponse(transaction));
  }

  async create(dto: CreateTransactionDto, userId: string) {
    const account = await this.repository.findAccountByIdAndUserId(
      dto.accountId,
      userId,
    );

    if (!account) {
      throw new NotFoundException('Account not found');
    }

    const category = await this.repository.findCategoryByIdAndUserId(
      dto.categoryId,
      userId,
    );

    if (!category) {
      throw new NotFoundException('Category not found');
    }

    if (category.type !== dto.type) {
      throw new BadRequestException(
        'Category type must match transaction type',
      );
    }

    const transaction = await this.repository.create({
      ...dto,
      date: new Date(dto.date),
    });

    return this.toResponse(transaction);
  }

  private toResponse(transaction: TransactionWithRelations) {
    return {
      id: transaction.id,
      type: transaction.type,
      amount: transaction.amount,
      description: transaction.description,
      date: transaction.date,
      transferId: transaction.transferId,
      transferDirection: transaction.transferDirection,
      account: {
        id: transaction.account.id,
        name: transaction.account.name,
        currency: transaction.account.currency,
      },
      category: transaction.category
        ? {
            id: transaction.category.id,
            name: transaction.category.name,
            type: transaction.category.type,
          }
        : null,
    };
  }
}
