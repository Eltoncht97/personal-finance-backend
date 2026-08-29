import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '../auth/guards/auth.guard';
import type { AuthenticatedRequest } from '../auth/types/authenticated-request.type';
import { BudgetsService } from './budgets.service';
import { CreateBudgetDto } from './dto/create-budget.dto';
import { MonthlyBudgetsQueryDto } from './dto/monthly-budgets-query.dto';
import { UpdateBudgetDto } from './dto/update-budget.dto';

@UseGuards(AuthGuard)
@Controller('budgets')
export class BudgetsController {
  constructor(private readonly budgetsService: BudgetsService) {}

  @Get()
  findMonthly(
    @Query() query: MonthlyBudgetsQueryDto,
    @Req() request: AuthenticatedRequest,
  ) {
    return this.budgetsService.findMonthly(
      query.year,
      query.month,
      request.user!.sub,
    );
  }

  @Post()
  create(@Body() dto: CreateBudgetDto, @Req() request: AuthenticatedRequest) {
    return this.budgetsService.create(dto, request.user!.sub);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() dto: UpdateBudgetDto,
    @Req() request: AuthenticatedRequest,
  ) {
    return this.budgetsService.update(id, dto, request.user!.sub);
  }
}
