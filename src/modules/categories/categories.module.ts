import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.module';
import { AuthModule } from '../auth/auth.module';
import { CategoryRepository } from './repositories/interfaces/category.repository';
import { PrismaCategoryRepository } from './repositories/implementations/prisma-category.repository';
import { CategoriesService } from './categories.service';
import { CategoriesController } from './categories.controller';

@Module({
  imports: [PrismaModule, AuthModule],
  controllers: [CategoriesController],
  providers: [
    CategoriesService,
    {
      provide: CategoryRepository,
      useClass: PrismaCategoryRepository,
    },
  ],
})
export class CategoriesModule {}
