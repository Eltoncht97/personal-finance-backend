import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { AccountsService } from './accounts.service';
import { CreateAccountDto } from './dto/create-account.dto';
import { AuthGuard } from '../auth/guards/auth.guard';
import type { AuthenticatedRequest } from '../auth/types/authenticated-request.type';

@UseGuards(AuthGuard)
@Controller('accounts')
export class AccountsController {
  constructor(private readonly accountsService: AccountsService) {}

  @Get()
  findAll(@Req() request: AuthenticatedRequest) {
    return this.accountsService.findAll(request.user!.sub);
  }

  @Post()
  create(@Body() dto: CreateAccountDto, @Req() request: AuthenticatedRequest) {
    return this.accountsService.create(dto, request.user!.sub);
  }
}
