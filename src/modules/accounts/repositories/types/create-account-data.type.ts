export type CreateAccountData = {
  name: string;
  currencyCode: string;
  isDefault?: boolean;
  initialBalance?: number;
  userId: string;
};
