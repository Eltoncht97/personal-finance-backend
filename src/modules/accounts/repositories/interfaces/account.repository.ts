import { Account } from '@prisma/client';
import { CreateAccountDto } from '../../dto/create-account.dto';

export abstract class AccountRepository {
  abstract findAllByUserId(id: string): Promise<Account[]>;
  abstract create(dto: CreateAccountDto, userId: string): Promise<Account>;
}
