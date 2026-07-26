import { Injectable, ServiceUnavailableException } from '@nestjs/common';
import { Prisma } from '@prisma/client';

import { SelicRate, SelicRateProvider } from '../interfaces/selic-rate-provider.interface';

interface BcbSeriesPoint {
  data: string;
  valor: string;
}

const BCB_SELIC_ANNUAL_SERIES = 1178;
const LOOKBACK_DAYS = 15;
const REQUEST_TIMEOUT_MS = 5000;

@Injectable()
export class BcbSelicRateProvider implements SelicRateProvider {
  private readonly cache = new Map<string, SelicRate>();

  async getAnnualRateForDate(date: Date): Promise<SelicRate> {
    const targetDate = this.startOfUtcDay(date);
    const cacheKey = targetDate.toISOString().slice(0, 10);
    const cached = this.cache.get(cacheKey);

    if (cached) {
      return cached;
    }

    const initialDate = new Date(targetDate);
    initialDate.setUTCDate(initialDate.getUTCDate() - LOOKBACK_DAYS);
    const url = new URL(
      `https://api.bcb.gov.br/dados/serie/bcdata.sgs.${BCB_SELIC_ANNUAL_SERIES}/dados`,
    );
    url.searchParams.set('formato', 'json');
    url.searchParams.set('dataInicial', this.formatBcbDate(initialDate));
    url.searchParams.set('dataFinal', this.formatBcbDate(targetDate));

    try {
      const response = await fetch(url, {
        headers: { Accept: 'application/json' },
        signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
      });

      if (!response.ok) {
        throw new Error(`BCB respondeu com HTTP ${response.status}.`);
      }

      const points = (await response.json()) as BcbSeriesPoint[];
      const selected = points
        .map((point) => ({
          annualRatePercent: new Prisma.Decimal(point.valor).toFixed(4),
          referenceDate: this.parseBcbDate(point.data),
        }))
        .filter((point) => point.referenceDate <= targetDate)
        .sort((a, b) => b.referenceDate.getTime() - a.referenceDate.getTime())[0];

      if (!selected) {
        throw new Error('Nenhuma taxa Selic foi encontrada para o período consultado.');
      }

      this.cache.set(cacheKey, selected);

      return selected;
    } catch (error) {
      throw new ServiceUnavailableException({
        code: 'SELIC_RATE_UNAVAILABLE',
        message: 'Nao foi possivel consultar a taxa Selic para a data do aporte.',
        detail: error instanceof Error ? error.message : undefined,
      });
    }
  }

  private startOfUtcDay(date: Date): Date {
    return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
  }

  private formatBcbDate(date: Date): string {
    return [
      String(date.getUTCDate()).padStart(2, '0'),
      String(date.getUTCMonth() + 1).padStart(2, '0'),
      date.getUTCFullYear(),
    ].join('/');
  }

  private parseBcbDate(value: string): Date {
    const [day, month, year] = value.split('/').map(Number);

    if (!day || !month || !year) {
      throw new Error(`Data invalida retornada pelo BCB: ${value}`);
    }

    return new Date(Date.UTC(year, month - 1, day));
  }
}
