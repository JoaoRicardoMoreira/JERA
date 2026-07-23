import { TransactionType } from '@prisma/client';

import { PrismaService } from '../../../src/database/prisma.service';
import { CategoriesRepository } from '../../../src/modules/categories/categories.repository';
import {
  cleanupDatabase,
  createPrismaService,
  createTestCategory,
  createTestUser,
  describeWithTestDatabase,
} from '../helpers/database';

describeWithTestDatabase('CategoriesRepository integration', () => {
  let prisma: PrismaService;
  let repository: CategoriesRepository;

  beforeAll(async () => {
    prisma = await createPrismaService();
    repository = new CategoriesRepository(prisma);
  });

  afterEach(async () => {
    await cleanupDatabase(prisma);
  });

  afterAll(async () => {
    await prisma.onModuleDestroy();
  });

  it('returns only active categories for the requested user', async () => {
    const user = await createTestUser(prisma, 'categories-owner');
    const otherUser = await createTestUser(prisma, 'categories-other');
    const activeCategory = await createTestCategory(prisma, user.id, TransactionType.EXPENSE);
    const deletedCategory = await createTestCategory(prisma, user.id, TransactionType.INCOME);
    await createTestCategory(prisma, otherUser.id, TransactionType.EXPENSE);
    await prisma.category.update({
      where: { id: deletedCategory.id },
      data: { deletedAt: new Date() },
    });

    const categories = await repository.findManyByUserId(user.id);

    expect(categories).toHaveLength(1);
    expect(categories[0]).toMatchObject({
      id: activeCategory.id,
      userId: user.id,
    });
  });
});
