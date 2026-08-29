export type CreateTransferData = {
  transferId: string;
  sourceAccountId: string;
  destinationAccountId: string;
  amount: number;
  description?: string;
  date: Date;
  userId: string;
};
