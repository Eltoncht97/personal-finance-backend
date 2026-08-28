import { Injectable } from '@nestjs/common';
import { AccountRepository } from './repositories/interfaces/account.repository';
import { CreateAccountDto } from './dto/create-account.dto';

@Injectable()
export class AccountsService {
  constructor(private readonly repository: AccountRepository) {}

  findAll(userId: string) {
    return this.repository.findAllByUserId(userId);
  }

  create(dto: CreateAccountDto, userId: string) {
    return this.repository.create({ ...dto, userId });
  }
}
