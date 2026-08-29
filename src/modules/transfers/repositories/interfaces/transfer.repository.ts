import { CreateTransferData } from '../types/create-transfer-data.type';
import { CreatedTransfer } from '../types/created-transfer.type';
import { TransferAccount } from '../types/transfer-account.type';

export abstract class TransferRepository {
  abstract findAccountByIdAndUserId(
    id: string,
    userId: string,
  ): Promise<TransferAccount | null>;
  abstract create(data: CreateTransferData): Promise<CreatedTransfer | null>;
}
