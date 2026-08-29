export type CreateTransactionData = {
  type: 'INCOME' | 'EXPENSE';
  amount: number;
  description?: string;
  date: Date;
  accountId: string;
  categoryId: string;
};
