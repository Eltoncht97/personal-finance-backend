import { Transform } from 'class-transformer';
import { IsIn, IsNotEmpty, IsString } from 'class-validator';

export class CreateCategoryDto {
  @Transform(({ value }: { value: unknown }) => {
    if (typeof value !== 'string') {
      return '';
    }

    return value.trim();
  })
  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsString()
  @IsIn(['INCOME', 'EXPENSE'])
  type!: 'INCOME' | 'EXPENSE';
}
