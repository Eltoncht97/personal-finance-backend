import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CategoryRepository } from './repositories/interfaces/category.repository';
import { CreateCategoryDto } from './dto/create-category';
import { UpdateCategoryDto } from './dto/update-category';

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

    if (existingCategory) {
      throw new BadRequestException(
        `Category ${dto.name} - ${dto.type} was already created`,
      );
    }

    return this.categoryRepository.create({ ...dto, userId });
  }

  async update(id: string, dto: UpdateCategoryDto, userId: string) {
    const category = await this.categoryRepository.findByIdAndUserId(
      id,
      userId,
    );

    if (!category) {
      throw new NotFoundException('Category not found');
    }

    const duplicatedCategory = await this.categoryRepository.findByNameAndType({
      name: dto.name,
      type: category.type,
      userId,
    });

    if (duplicatedCategory && duplicatedCategory.id !== id) {
      throw new BadRequestException(
        `Category ${dto.name} - ${category.type} was already created`,
      );
    }

    return this.categoryRepository.update(id, {
      name: dto.name,
    });
  }
}
