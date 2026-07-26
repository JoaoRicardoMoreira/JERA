import { InvestmentConfigEntity } from '../entities/investment-config.entity';
import { InvestmentContributionEntity } from '../entities/investment-contribution.entity';
import { InvestmentRepository } from '../interfaces/investment-repository.interface';
import { SelicRateProvider } from '../interfaces/selic-rate-provider.interface';
import { InvestmentsService } from '../investments.service';
import { InvestmentValidator } from '../validators/investment.validator';

describe('InvestmentsService', () => {
  const selicRateProvider = {
    getAnnualRateForDate: jest.fn(),
  } as jest.Mocked<SelicRateProvider>;

  beforeEach(() => {
    jest.clearAllMocks();
  });

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
            '12.6825',
            new Date('2026-01-01T00:00:00.000Z'),
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
            '12.6825',
            new Date('2026-02-01T00:00:00.000Z'),
            now,
            now,
            null,
          ),
        ]),
    } as unknown as jest.Mocked<InvestmentRepository>;
    const service = new InvestmentsService(
      repository,
      new InvestmentValidator(),
      selicRateProvider,
    );

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
            '12.6825',
            new Date('2026-01-15T00:00:00.000Z'),
            now,
            now,
            null,
          ),
        ]),
    } as unknown as jest.Mocked<InvestmentRepository>;
    const service = new InvestmentsService(
      repository,
      new InvestmentValidator(),
      selicRateProvider,
    );

    const overview = await service.getOverview(userId, { month: 3, year: 2026 });

    expect(overview.patrimonioFinal).toBe('1010.00');
  });

  it('persists the Selic rate returned for the contribution date', async () => {
    const userId = '2e3c3c78-26dc-4a97-8c6c-cc3b8f4e8f4c';
    const contributedAt = new Date('2026-07-26T12:00:00.000Z');
    const referenceDate = new Date('2026-07-24T00:00:00.000Z');
    const repository = {
      upsertContribution: jest
        .fn()
        .mockImplementation((data) =>
          Promise.resolve(
            new InvestmentContributionEntity(
              'contribution-id',
              userId,
              data.amount,
              data.contributedAt,
              data.month,
              data.year,
              data.selicAnnualRatePercent,
              data.selicReferenceDate,
              contributedAt,
              contributedAt,
              null,
            ),
          ),
        ),
      upsertConfig: jest
        .fn()
        .mockResolvedValue(
          new InvestmentConfigEntity(
            'config-id',
            userId,
            '1.1074',
            contributedAt,
            contributedAt,
            null,
          ),
        ),
    } as unknown as jest.Mocked<InvestmentRepository>;
    selicRateProvider.getAnnualRateForDate.mockResolvedValue({
      annualRatePercent: '14.1500',
      referenceDate,
    });
    const service = new InvestmentsService(
      repository,
      new InvestmentValidator(),
      selicRateProvider,
    );

    const result = await service.upsertContribution(userId, {
      amount: '1000.00',
      contributedAt: contributedAt.toISOString(),
    });

    expect(selicRateProvider.getAnnualRateForDate).toHaveBeenCalledWith(contributedAt);
    expect(repository.upsertContribution).toHaveBeenCalledWith(
      expect.objectContaining({
        selicAnnualRatePercent: '14.1500',
        selicReferenceDate: referenceDate,
      }),
    );
    expect(result.selicAnnualRatePercent).toBe('14.1500');
    expect(result.selicReferenceDate).toBe(referenceDate.toISOString());
  });

  it('rejects a future contribution before consulting the Banco Central', async () => {
    const repository = {} as jest.Mocked<InvestmentRepository>;
    const service = new InvestmentsService(
      repository,
      new InvestmentValidator(),
      selicRateProvider,
    );

    await expect(
      service.upsertContribution('user-id', {
        amount: '1000.00',
        contributedAt: '2099-01-01T12:00:00.000Z',
      }),
    ).rejects.toMatchObject({
      response: expect.objectContaining({ code: 'FUTURE_INVESTMENT_CONTRIBUTION' }),
    });
    expect(selicRateProvider.getAnnualRateForDate).not.toHaveBeenCalled();
  });
});
