import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.module';
import { AuthModule } from '../auth/auth.module';
import { PrismaTransferRepository } from './repositories/implementations/prisma-transfer.repository';
import { TransferRepository } from './repositories/interfaces/transfer.repository';
import { TransfersController } from './transfers.controller';
import { TransfersService } from './transfers.service';

@Module({
  imports: [PrismaModule, AuthModule],
  controllers: [TransfersController],
  providers: [
    TransfersService,
    {
      provide: TransferRepository,
      useClass: PrismaTransferRepository,
    },
  ],
})
export class TransfersModule {}
