import { InvestmentConfigEntity } from '../entities/investment-config.entity';
import { InvestmentContributionEntity } from '../entities/investment-contribution.entity';
import { InvestmentRepository } from '../interfaces/investment-repository.interface';
import { InvestmentsService } from '../investments.service';
import { InvestmentValidator } from '../validators/investment.validator';

describe('InvestmentsService', () => {
  it('compounds each contribution only for its completed invested months', async () => {
    const userId = '2e3c3c78-26dc-4a97-8c6c-cc3b8f4e8f4c';
    const now = new Date('2026-03-01T12:00:00.000Z');
    const repository = {
      getOrCreateConfig: jest
        .fn()
        .mockResolvedValue(
          new InvestmentConfigEntity('config-id', userId, '1.0000', now, now, null),
        ),
      findContributionsByUserId: jest
        .fn()
        .mockResolvedValue([
          new InvestmentContributionEntity(
            'january',
            userId,
            '1000.00',
            new Date('2026-01-01T12:00:00.000Z'),
            1,
            2026,
            now,
            now,
            null,
          ),
          new InvestmentContributionEntity(
            'february',
            userId,
            '1000.00',
            new Date('2026-02-01T12:00:00.000Z'),
            2,
            2026,
            now,
            now,
            null,
          ),
        ]),
    } as unknown as jest.Mocked<InvestmentRepository>;
    const service = new InvestmentsService(repository, new InvestmentValidator());

    const overview = await service.getOverview(userId, { month: 3, year: 2026 });

    expect(overview.patrimonioFinal).toBe('2030.10');
    expect(overview.timeline.map((point) => point.patrimonio)).toEqual([
      '1000.00',
      '2010.00',
      '2030.10',
    ]);
  });

  it('does not count a partial month before the contribution anniversary', async () => {
    const userId = '2e3c3c78-26dc-4a97-8c6c-cc3b8f4e8f4c';
    const now = new Date('2026-03-01T12:00:00.000Z');
    const repository = {
      getOrCreateConfig: jest
        .fn()
        .mockResolvedValue(
          new InvestmentConfigEntity('config-id', userId, '1.0000', now, now, null),
        ),
      findContributionsByUserId: jest
        .fn()
        .mockResolvedValue([
          new InvestmentContributionEntity(
            'january-15',
            userId,
            '1000.00',
            new Date('2026-01-15T12:00:00.000Z'),
            1,
            2026,
            now,
            now,
            null,
          ),
        ]),
    } as unknown as jest.Mocked<InvestmentRepository>;
    const service = new InvestmentsService(repository, new InvestmentValidator());

    const overview = await service.getOverview(userId, { month: 3, year: 2026 });

    expect(overview.patrimonioFinal).toBe('1010.00');
  });
});
