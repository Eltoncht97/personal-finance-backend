import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '../auth/guards/auth.guard';
import type { AuthenticatedRequest } from '../auth/types/authenticated-request.type';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { TransactionsService } from './transactions.service';

@UseGuards(AuthGuard)
@Controller('transactions')
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  @Get()
  findAll(@Req() request: AuthenticatedRequest) {
    return this.transactionsService.findAll(request.user!.sub);
  }

  @Post()
  create(
    @Body() dto: CreateTransactionDto,
    @Req() request: AuthenticatedRequest,
  ) {
    return this.transactionsService.create(dto, request.user!.sub);
  }
}
