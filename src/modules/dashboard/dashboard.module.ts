import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.module';
import { AuthModule } from '../auth/auth.module';
import { DashboardController } from './dashboard.controller';
import { DashboardService } from './dashboard.service';
import { DashboardRepository } from './repositories/interfaces/dashboard.repository';
import { PrismaDashboardRepository } from './repositories/implementations/prisma-dashboard.repository';

@Module({
  imports: [PrismaModule, AuthModule],
  controllers: [DashboardController],
  providers: [
    DashboardService,
    {
      provide: DashboardRepository,
      useClass: PrismaDashboardRepository,
    },
  ],
})
export class DashboardModule {}
