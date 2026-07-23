import { Inject, Injectable } from '@nestjs/common';

import { CategoryResponseDto } from './dto/category-response.dto';
import {
  CATEGORIES_REPOSITORY,
  CategoryRepository,
} from './interfaces/category-repository.interface';
import { CategoryService } from './interfaces/category-service.interface';
import { CategoryMapper } from './mapper/category.mapper';

@Injectable()
export class CategoriesService implements CategoryService {
  constructor(
    @Inject(CATEGORIES_REPOSITORY)
    private readonly categoriesRepository: CategoryRepository,
  ) {}

  async listByUser(userId: string): Promise<CategoryResponseDto[]> {
    const categories = await this.categoriesRepository.findManyByUserId(userId);

    return categories.map(CategoryMapper.toResponse);
  }
}
