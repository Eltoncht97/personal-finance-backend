import { TransferAccount } from './transfer-account.type';

export type CreatedTransfer = {
  transferId: string;
  amount: number;
  description?: string;
  date: Date;
  sourceAccount: TransferAccount;
  destinationAccount: TransferAccount;
};
