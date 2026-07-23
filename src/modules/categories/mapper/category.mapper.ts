import { Category } from '@prisma/client';

import { CategoryResponseDto } from '../dto/category-response.dto';
import { CategoryEntity } from '../entities/category.entity';

type PrismaCategory = Pick<
  Category,
  'id' | 'userId' | 'name' | 'type' | 'createdAt' | 'updatedAt' | 'deletedAt'
>;

export class CategoryMapper {
  static toEntity(category: PrismaCategory): CategoryEntity {
    return new CategoryEntity(
      category.id,
      category.userId,
      category.name,
      category.type,
      category.createdAt,
      category.updatedAt,
      category.deletedAt,
    );
  }

  static toResponse(category: CategoryEntity): CategoryResponseDto {
    return {
      id: category.id,
      name: category.name,
      type: category.type,
      createdAt: category.createdAt.toISOString(),
      updatedAt: category.updatedAt.toISOString(),
    };
  }
}
