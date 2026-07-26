import { BcbSelicRateProvider } from '../providers/bcb-selic-rate.provider';

describe('BcbSelicRateProvider', () => {
  const originalFetch = global.fetch;

  afterEach(() => {
    global.fetch = originalFetch;
    jest.restoreAllMocks();
  });

  it('uses the latest business-day rate on or before the contribution date', async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => [
        { data: '23/07/2026', valor: '14.14' },
        { data: '24/07/2026', valor: '14.15' },
      ],
    }) as jest.Mock;
    const provider = new BcbSelicRateProvider();

    const result = await provider.getAnnualRateForDate(new Date('2026-07-26T12:00:00.000Z'));

    expect(result).toEqual({
      annualRatePercent: '14.1500',
      referenceDate: new Date('2026-07-24T00:00:00.000Z'),
    });
    expect(global.fetch).toHaveBeenCalledWith(
      expect.objectContaining({
        href: expect.stringContaining('bcdata.sgs.1178'),
      }),
      expect.objectContaining({
        headers: { Accept: 'application/json' },
      }),
    );
  });
});
