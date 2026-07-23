import { PrismaService } from '../../../src/database/prisma.service';
import { UsersRepository } from '../../../src/modules/users/users.repository';
import { cleanupDatabase, createPrismaService, createTestUser, describeWithTestDatabase } from '../helpers/database';

describeWithTestDatabase('UsersRepository integration', () => {
  let prisma: PrismaService;
  let repository: UsersRepository;

  beforeAll(async () => {
    prisma = await createPrismaService();
    repository = new UsersRepository(prisma);
  });

  afterEach(async () => {
    await cleanupDatabase(prisma);
  });

  afterAll(async () => {
    await prisma.onModuleDestroy();
  });

  it('finds active users by id and email', async () => {
    const user = await createTestUser(prisma);

    await expect(repository.findById(user.id)).resolves.toMatchObject({
      id: user.id,
      email: user.email,
    });
    await expect(repository.findByEmail(user.email)).resolves.toMatchObject({
      id: user.id,
      email: user.email,
    });
  });

  it('ignores soft deleted users', async () => {
    const user = await createTestUser(prisma);
    await prisma.user.update({
      where: { id: user.id },
      data: { deletedAt: new Date() },
    });

    await expect(repository.findById(user.id)).resolves.toBeNull();
    await expect(repository.findByEmail(user.email)).resolves.toBeNull();
  });
});
