import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { TransferRepository } from '../interfaces/transfer.repository';
import { CreateTransferData } from '../types/create-transfer-data.type';
import { CreatedTransfer } from '../types/created-transfer.type';
import { TransferAccount } from '../types/transfer-account.type';

@Injectable()
export class PrismaTransferRepository extends TransferRepository {
  constructor(private readonly prismaService: PrismaService) {
    super();
  }

  findAccountByIdAndUserId(
    id: string,
    userId: string,
  ): Promise<TransferAccount | null> {
    return this.prismaService.account.findFirst({
      where: { id, userId },
      include: { currency: true },
    });
  }

  create(data: CreateTransferData): Promise<CreatedTransfer | null> {
    return this.prismaService.$transaction(async (tx) => {
      const sourceUpdate = await tx.account.updateMany({
        where: {
          id: data.sourceAccountId,
          userId: data.userId,
          balance: { gte: data.amount },
        },
        data: { balance: { decrement: data.amount } },
      });

      if (sourceUpdate.count === 0) {
        return null;
      }

      const destinationUpdate = await tx.account.updateMany({
        where: {
          id: data.destinationAccountId,
          userId: data.userId,
        },
        data: { balance: { increment: data.amount } },
      });

      if (destinationUpdate.count === 0) {
        throw new Error('Destination account not found');
      }

      await tx.transaction.createMany({
        data: [
          {
            type: 'TRANSFER',
            amount: data.amount,
            description: data.description,
            date: data.date,
            accountId: data.sourceAccountId,
            categoryId: null,
            transferId: data.transferId,
            transferDirection: 'OUT',
          },
          {
            type: 'TRANSFER',
            amount: data.amount,
            description: data.description,
            date: data.date,
            accountId: data.destinationAccountId,
            categoryId: null,
            transferId: data.transferId,
            transferDirection: 'IN',
          },
        ],
      });

      const [sourceAccount, destinationAccount] = await Promise.all([
        tx.account.findUnique({
          where: { id: data.sourceAccountId },
          include: { currency: true },
        }),
        tx.account.findUnique({
          where: { id: data.destinationAccountId },
          include: { currency: true },
        }),
      ]);

      if (!sourceAccount || !destinationAccount) {
        throw new Error('Transfer accounts not found');
      }

      return {
        transferId: data.transferId,
        amount: data.amount,
        description: data.description,
        date: data.date,
        sourceAccount,
        destinationAccount,
      };
    });
  }
}
