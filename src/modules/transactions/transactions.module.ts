import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.module';
import { AuthModule } from '../auth/auth.module';
import { PrismaTransactionRepository } from './repositories/implementations/prisma-transaction.repository';
import { TransactionRepository } from './repositories/interfaces/transaction.repository';
import { TransactionsController } from './transactions.controller';
import { TransactionsService } from './transactions.service';

@Module({
  imports: [PrismaModule, AuthModule],
  controllers: [TransactionsController],
  providers: [
    TransactionsService,
    {
      provide: TransactionRepository,
      useClass: PrismaTransactionRepository,
    },
  ],
})
export class TransactionsModule {}
