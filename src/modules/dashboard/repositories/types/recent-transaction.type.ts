export type RecentTransaction = {
  id: string;
  type: 'INCOME' | 'EXPENSE' | 'TRANSFER' | 'OPENING_BALANCE';
  amount: number;
  description: string | null;
  date: Date;
  transferDirection: 'IN' | 'OUT' | null;
  account: {
    id: string;
    name: string;
    currencyCode: string;
  };
  category: {
    id: string;
    name: string;
  } | null;
};
