import { Account } from '@prisma/client';
import { CreateAccountData } from '../types/create-account-data.type';

export abstract class AccountRepository {
  abstract findAllByUserId(userId: string): Promise<Account[]>;
  abstract create(data: CreateAccountData): Promise<Account>;
}
