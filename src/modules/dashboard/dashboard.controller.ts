import { Controller, Get, Query, Req, UseGuards } from '@nestjs/common';
import { MonthlySummaryQueryDto } from './dto/monthly-summary-query.dto';
import type { AuthenticatedRequest } from '../auth/types/authenticated-request.type';
import { AuthGuard } from '../auth/guards/auth.guard';
import { DashboardService } from './dashboard.service';

@UseGuards(AuthGuard)
@Controller('dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get('monthly-summary')
  getMonthlySummary(
    @Query() query: MonthlySummaryQueryDto,
    @Req() request: AuthenticatedRequest,
  ) {
    return this.dashboardService.getMonthlySummary(
      query.year,
      query.month,
      request.user!.sub,
    );
  }
}
