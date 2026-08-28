import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.module';
import { AccountRepository } from './repositories/interfaces/account.repository';
import { PrismaAccountRepository } from './repositories/implementations/prisma-account.repository';
import { AccountsService } from './accounts.service';
import { AccountsController } from './accounts.controller';

@Module({
  imports: [PrismaModule],
  controllers: [AccountsController],
  providers: [
    AccountsService,
    { provide: AccountRepository, useClass: PrismaAccountRepository },
  ],
})
export class AccountsModule {}
