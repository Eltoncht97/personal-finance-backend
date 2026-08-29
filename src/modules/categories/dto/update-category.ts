import { Transform } from 'class-transformer';
import { IsString, IsNotEmpty } from 'class-validator';

export class UpdateCategoryDto {
  @Transform(({ value }: { value: unknown }) => {
    if (typeof value !== 'string') {
      return '';
    }

    return value.trim();
  })
  @IsString()
  @IsNotEmpty()
  name!: string;
}
