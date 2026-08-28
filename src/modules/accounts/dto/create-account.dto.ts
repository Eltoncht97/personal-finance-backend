import { Transform } from 'class-transformer';
import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateAccountDto {
  @Transform(({ value }: { value: unknown }) => {
    if (typeof value !== 'string') {
      return '';
    }

    return value.trim();
  })
  @IsString()
  @IsNotEmpty()
  name!: string;

  @Transform(({ value }: { value: unknown }) => {
    if (typeof value !== 'string') {
      return '';
    }

    return value.trim().toUpperCase();
  })
  @IsString()
  @IsNotEmpty()
  currencyCode!: string;

  @IsBoolean()
  @IsOptional()
  isDefault?: boolean;
}
