import { Injectable } from '@nestjs/common';

import { PrismaService } from '../../database/prisma.service';
import { CategoryEntity } from './entities/category.entity';
import { CategoryRepository } from './interfaces/category-repository.interface';
import { CategoryMapper } from './mapper/category.mapper';

@Injectable()
export class CategoriesRepository implements CategoryRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findManyByUserId(userId: string): Promise<CategoryEntity[]> {
    const categories = await this.prisma.category.findMany({
      where: {
        userId,
        deletedAt: null,
      },
      orderBy: [{ type: 'asc' }, { name: 'asc' }],
    });

    return categories.map(CategoryMapper.toEntity);
  }
}
