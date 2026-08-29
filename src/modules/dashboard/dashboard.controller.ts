import { Controller, Get, Query, Req, UseGuards } from '@nestjs/common';
import { MonthlySummaryQueryDto } from './dto/monthly-summary-query.dto';
import type { AuthenticatedRequest } from '../auth/types/authenticated-request.type';
import { AuthGuard } from '../auth/guards/auth.guard';

@UseGuards(AuthGuard)
@Controller('dashboard')
export class DashboardController {
  constructor() {}

  @Get('monthly-summary')
  getMonthlySummary(
    @Query() dto: MonthlySummaryQueryDto,
    @Req() request: AuthenticatedRequest,
  ) {
    console.log({ dto, request });
    return true;
    // return this.dashboardService.getMonthlySummary(
    //   query.year,
    //   query.month,
    //   request.user!.sub,
    // );
  }
}
