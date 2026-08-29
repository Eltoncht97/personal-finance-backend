import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { TransactionRepository } from './repositories/interfaces/transaction.repository';
import { TransactionWithRelations } from './repositories/types/transaction-with-relations.type';

@Injectable()
export class TransactionsService {
  constructor(private readonly repository: TransactionRepository) {}

  async findAll(userId: string) {
    const transactions = await this.repository.findAllByUserId(userId);

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
