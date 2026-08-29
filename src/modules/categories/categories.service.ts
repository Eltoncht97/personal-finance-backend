import { BadRequestException, Injectable } from '@nestjs/common';
import { CategoryRepository } from './repositories/interfaces/category.repository';
import { CreateCategoryDto } from './dto/create-category';

@Injectable()
export class CategoriesService {
  constructor(private readonly categoryRepository: CategoryRepository) {}

  findAll(userId: string) {
    return this.categoryRepository.findAllByUserId(userId);
  }

  async create(dto: CreateCategoryDto, userId: string) {
    const existingCategory = await this.categoryRepository.findByNameAndType({
      ...dto,
      userId,
    });

    if (!existingCategory) {
      throw new BadRequestException(
        `Category ${dto.name} - ${dto.type} was already created`,
      );
    }

    return this.categoryRepository.create({ ...dto, userId });
  }
}
