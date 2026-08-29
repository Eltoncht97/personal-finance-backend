import { Injectable } from '@nestjs/common';
import { Category } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { CategoryRepository } from '../interfaces/category.repository';
import { CreateCategoryData } from '../types/create-category-data.type';
import { FindCategoryData } from '../types/find-category-data.type';
// import { UpdateCategoryDto } from '../../dto/update-category';

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

  create(data: CreateCategoryData): Promise<Category> {
    return this.prismaService.category.create({ data });
  }

  // async update(id: string, data: UpdateCategoryDto): Promise<Category> {
  //   await this.prismaService.category.updateMany({
  //     where: { id },
  //     data: { name: data.name },
  //   });

  //   return this.prismaService.category.findUnique({ where: { id } });
  // }
}
