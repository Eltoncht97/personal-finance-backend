import { Type } from 'class-transformer';
import { IsInt, IsNumber, IsPositive, IsUUID, Max, Min } from 'class-validator';

export class CreateBudgetDto {
  @IsUUID()
  categoryId!: string;

  @IsNumber()
  @IsPositive()
  amount!: number;

  @Type(() => Number)
  @IsInt()
  @Min(2000)
  year!: number;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(12)
  month!: number;
}
