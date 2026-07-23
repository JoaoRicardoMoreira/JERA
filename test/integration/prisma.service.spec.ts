import { PrismaService } from '../../src/database/prisma.service';
import { cleanupDatabase, createPrismaService, describeWithTestDatabase } from './helpers/database';

describeWithTestDatabase('PrismaService integration', () => {
  let prisma: PrismaService;

  beforeAll(async () => {
    prisma = await createPrismaService();
  });

  afterEach(async () => {
    await cleanupDatabase(prisma);
  });

  afterAll(async () => {
    await prisma.onModuleDestroy();
  });

  it('connects to the test PostgreSQL database', async () => {
    const result = await prisma.$queryRaw<Array<{ value: number }>>`SELECT 1 as value`;

    expect(result).toEqual([{ value: 1 }]);
  });
});
