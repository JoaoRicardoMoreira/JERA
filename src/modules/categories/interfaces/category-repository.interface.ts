import { CategoryEntity } from '../entities/category.entity';

export const CATEGORIES_REPOSITORY = Symbol('CATEGORIES_REPOSITORY');

export interface CategoryRepository {
  findManyByUserId(userId: string): Promise<CategoryEntity[]>;
}
