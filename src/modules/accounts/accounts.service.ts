import { Injectable } from '@nestjs/common';
import { AccountRepository } from './repositories/interfaces/account.repository';
import { CreateAccountDto } from './dto/create-account.dto';

@Injectable()
export class AccountsService {
  constructor(private readonly repository: AccountRepository) {}

  async findAll(userId: string) {
    const accounts = await this.repository.findAllByUserId(userId);

    return accounts.map((account) => ({
      id: account.id,
      name: account.name,
      isDefault: account.isDefault,
      currency: account.currency,
    }));
  }

  async create(dto: CreateAccountDto, userId: string) {
    const account = await this.repository.create({ ...dto, userId });

    return {
      id: account.id,
      name: account.name,
      isDefault: account.isDefault,
      currency: account.currency,
    };
  }
}
