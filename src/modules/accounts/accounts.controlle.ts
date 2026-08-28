import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { AccountsService } from './accounts.service';
import { CreateAccountDto } from './dto/create-account.dto';
import { AuthGuard } from '../auth/guards/auth.guard';
import type { AuthenticatedRequest } from '../auth/types/authenticated-request.type';

@UseGuards(AuthGuard)
@Controller()
export class AccountsController {
  constructor(private readonly accountsService: AccountsService) {}

  @Get()
  getAll(@Req() request: AuthenticatedRequest) {
    return this.accountsService.findAll(request.user!.sub);
  }

  @Post()
  createAccount(
    @Req() request: AuthenticatedRequest,
    @Body() dto: CreateAccountDto,
  ) {
    return this.accountsService.create(dto, request.user!.sub);
  }
}
