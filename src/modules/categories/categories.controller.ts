import { Controller, Get, UseGuards, Req, Post, Body } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { AuthGuard } from '../auth/guards/auth.guard';
import type { AuthenticatedRequest } from '../auth/types/authenticated-request.type';
import { CreateCategoryDto } from './dto/create-category';

@UseGuards(AuthGuard)
@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Get()
  findAll(@Req() request: AuthenticatedRequest) {
    return this.categoriesService.findAll(request.user!.sub);
  }

  @Post()
  create(@Req() request: AuthenticatedRequest, @Body() dto: CreateCategoryDto) {
    return this.categoriesService.create(dto, request.user!.sub);
  }
}
