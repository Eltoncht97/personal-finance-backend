import { Category } from '@prisma/client';
import { CreateCategoryData } from '../types/create-category-data.type';
import { FindCategoryData } from '../types/find-category-data.type';
import { UpdateCategoryData } from '../types/update-category-data.type';

export abstract class CategoryRepository {
  abstract findAllByUserId(userId: string): Promise<Category[]>;
  abstract findByNameAndType(data: FindCategoryData): Promise<Category | null>;
  abstract findByIdAndUserId(
    id: string,
    userId: string,
  ): Promise<Category | null>;
  abstract create(data: CreateCategoryData): Promise<Category>;
  abstract update(id: string, data: UpdateCategoryData): Promise<Category>;
}
