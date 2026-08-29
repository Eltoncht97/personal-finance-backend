import { Injectable } from '@nestjs/common';
import { Category } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { CategoryRepository } from '../interfaces/category.repository';
import { CreateCategoryData } from '../types/create-category-data.type';
import { FindCategoryData } from '../types/find-category-data.type';
import { UpdateCategoryData } from '../types/update-category-data.type';

@Injectable()
export class PrismaCategoryRepository extends CategoryRepository {
  constructor(private readonly prismaService: PrismaService) {
    super();
  }

  findAllByUserId(userId: string): Promise<Category[]> {
    return this.prismaService.category.findMany({
      where: { userId },
    });
  }

  findByNameAndType(data: FindCategoryData): Promise<Category | null> {
    return this.prismaService.category.findFirst({
      where: {
        name: data.name,
        type: data.type,
        userId: data.userId,
      },
    });
  }

  findByIdAndUserId(id: string, userId: string): Promise<Category | null> {
    return this.prismaService.category.findFirst({ where: { id, userId } });
  }

  create(data: CreateCategoryData): Promise<Category> {
    return this.prismaService.category.create({ data });
  }

  update(id: string, data: UpdateCategoryData): Promise<Category> {
    return this.prismaService.category.update({
      where: { id },
      data: { name: data.name },
    });
  }
}
