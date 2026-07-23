import { CategoryResponseDto } from '../dto/category-response.dto';

export const CATEGORIES_SERVICE = Symbol('CATEGORIES_SERVICE');

export interface CategoryService {
  listByUser(userId: string): Promise<CategoryResponseDto[]>;
}
