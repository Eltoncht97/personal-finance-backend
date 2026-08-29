import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { CreateTransferDto } from './dto/create-transfer.dto';
import { TransferRepository } from './repositories/interfaces/transfer.repository';

@Injectable()
export class TransfersService {
  constructor(private readonly repository: TransferRepository) {}

  async create(dto: CreateTransferDto, userId: string) {
    if (dto.sourceAccountId === dto.destinationAccountId) {
      throw new BadRequestException(
        'Source and destination accounts must be different',
      );
    }

    const [sourceAccount, destinationAccount] = await Promise.all([
      this.repository.findAccountByIdAndUserId(dto.sourceAccountId, userId),
      this.repository.findAccountByIdAndUserId(
        dto.destinationAccountId,
        userId,
      ),
    ]);

    if (!sourceAccount) {
      throw new NotFoundException('Source account not found');
    }

    if (!destinationAccount) {
      throw new NotFoundException('Destination account not found');
    }

    if (sourceAccount.currencyCode !== destinationAccount.currencyCode) {
      throw new BadRequestException('Accounts must use the same currency');
    }

    if (sourceAccount.balance.lessThan(dto.amount)) {
      throw new BadRequestException('Insufficient balance');
    }

    const transfer = await this.repository.create({
      ...dto,
      date: new Date(dto.date),
      transferId: randomUUID(),
      userId,
    });

    if (!transfer) {
      throw new BadRequestException('Insufficient balance');
    }

    return {
      transferId: transfer.transferId,
      amount: transfer.amount,
      date: transfer.date,
      description: transfer.description ?? null,
      sourceAccount: {
        id: transfer.sourceAccount.id,
        name: transfer.sourceAccount.name,
        balance: transfer.sourceAccount.balance,
        currency: transfer.sourceAccount.currency,
      },
      destinationAccount: {
        id: transfer.destinationAccount.id,
        name: transfer.destinationAccount.name,
        balance: transfer.destinationAccount.balance,
        currency: transfer.destinationAccount.currency,
      },
    };
  }
}
