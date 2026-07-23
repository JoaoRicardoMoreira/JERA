import { TransactionType } from '@prisma/client';
import { Test, TestingModule } from '@nestjs/testing';

import { CategoriesService } from '../categories.service';
import { CategoryEntity } from '../entities/category.entity';
import {
  CATEGORIES_REPOSITORY,
  CategoryRepository,
} from '../interfaces/category-repository.interface';

describe('CategoriesService', () => {
  let service: CategoriesService;
  let repository: jest.Mocked<CategoryRepository>;

  const category = new CategoryEntity(
    '6d7f1e72-6b30-49d2-bbb0-5e2dbf0e5b67',
    '2e3c3c78-26dc-4a97-8c6c-cc3b8f4e8f4c',
    'Alimentacao',
    TransactionType.EXPENSE,
    new Date('2026-07-03T00:00:00.000Z'),
    new Date('2026-07-03T00:00:00.000Z'),
    null,
  );

  beforeEach(async () => {
    repository = {
      findManyByUserId: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CategoriesService,
        {
          provide: CATEGORIES_REPOSITORY,
          useValue: repository,
        },
      ],
    }).compile();

    service = module.get(CategoriesService);
  });

  it('should list categories for the authenticated user', async () => {
    repository.findManyByUserId.mockResolvedValue([category]);

    const response = await service.listByUser(category.userId);

    expect(repository.findManyByUserId).toHaveBeenCalledWith(category.userId);
    expect(response).toEqual([
      {
        id: category.id,
        name: category.name,
        type: category.type,
        createdAt: '2026-07-03T00:00:00.000Z',
        updatedAt: '2026-07-03T00:00:00.000Z',
      },
    ]);
  });

  it('should return an empty list when the user has no active categories', async () => {
    repository.findManyByUserId.mockResolvedValue([]);

    await expect(service.listByUser(category.userId)).resolves.toEqual([]);
  });
});
