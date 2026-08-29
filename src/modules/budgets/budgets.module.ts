import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.module';
import { AuthModule } from '../auth/auth.module';
import { BudgetsController } from './budgets.controller';
import { BudgetsService } from './budgets.service';
import { PrismaBudgetsRepository } from './repositories/implementations/prisma-budgets.repository';
import { BudgetsRepository } from './repositories/interfaces/budgets.repository';

@Module({
  imports: [PrismaModule, AuthModule],
  controllers: [BudgetsController],
  providers: [
    BudgetsService,
    {
      provide: BudgetsRepository,
      useClass: PrismaBudgetsRepository,
    },
  ],
})
export class BudgetsModule {}
