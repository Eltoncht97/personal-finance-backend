import { Transform } from 'class-transformer';
import {
  IsDateString,
  IsIn,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  IsUUID,
} from 'class-validator';

export class CreateTransactionDto {
  @IsString()
  @IsIn(['INCOME', 'EXPENSE'])
  type!: 'INCOME' | 'EXPENSE';

  @IsNumber()
  @IsPositive()
  amount!: number;

  @Transform(({ value }: { value: unknown }) => {
    if (typeof value !== 'string') {
      return value;
    }

    return value.trim();
  })
  @IsString()
  @IsOptional()
  description?: string;

  @IsDateString()
  date!: string;

  @IsUUID()
  accountId!: string;

  @IsUUID()
  categoryId!: string;
}
