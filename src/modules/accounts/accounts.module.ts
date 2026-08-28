import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.module';
import { AccountRepository } from './repositories/interfaces/account.repository';
import { PrismaAccountRepository } from './repositories/implementations/prisma-account.repository';
import { AccountsService } from './accounts.service';
import { AccountsController } from './accounts.controller';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [PrismaModule, AuthModule],
  controllers: [AccountsController],
  providers: [
    AccountsService,
    { provide: AccountRepository, useClass: PrismaAccountRepository },
  ],
})
export class AccountsModule {}
