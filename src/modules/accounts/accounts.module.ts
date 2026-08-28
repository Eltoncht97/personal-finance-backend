import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.module';
import { AccountRepository } from './repositories/interfaces/account.repository';
import { PrismaAccountRepository } from './repositories/implementations/prisma-account.repository';

@Module({
  imports: [PrismaModule],
  controllers: [],
  providers: [
    { provide: AccountRepository, useClass: PrismaAccountRepository },
  ],
})
export class AccountsModule {}
