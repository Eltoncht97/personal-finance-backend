import { CreateAccountData } from '../types/create-account-data.type';
import { AccountWithCurrency } from '../types/account-with-currency.type';

export abstract class AccountRepository {
  abstract findAllByUserId(userId: string): Promise<AccountWithCurrency[]>;
  abstract create(data: CreateAccountData): Promise<AccountWithCurrency>;
}
