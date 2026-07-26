import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';

import { PrismaService } from '../../database/prisma.service';
import { InvestmentConfigEntity } from './entities/investment-config.entity';
import { InvestmentContributionEntity } from './entities/investment-contribution.entity';
import {
  InvestmentRepository,
  SetContributionSelicRateData,
  UpsertInvestmentConfigData,
  UpsertInvestmentContributionData,
} from './interfaces/investment-repository.interface';
import { InvestmentMapper } from './mapper/investment.mapper';

@Injectable()
export class InvestmentsRepository implements InvestmentRepository {
  constructor(private readonly prisma: PrismaService) {}

  async getOrCreateConfig(userId: string): Promise<InvestmentConfigEntity> {
    const config = await this.prisma.investmentConfig.upsert({
      where: {
        userId,
      },
      create: {
        userId,
        monthlyRatePercent: new Prisma.Decimal(0),
      },
      update: {
        deletedAt: null,
      },
    });

    return InvestmentMapper.toConfigEntity(config);
  }

  async upsertConfig(data: UpsertInvestmentConfigData): Promise<InvestmentConfigEntity> {
    const config = await this.prisma.investmentConfig.upsert({
      where: {
        userId: data.userId,
      },
      create: {
        userId: data.userId,
        monthlyRatePercent: new Prisma.Decimal(data.taxaMensalPercent),
      },
      update: {
        monthlyRatePercent: new Prisma.Decimal(data.taxaMensalPercent),
        deletedAt: null,
      },
    });

    return InvestmentMapper.toConfigEntity(config);
  }

  async findContributionsByUserId(userId: string): Promise<InvestmentContributionEntity[]> {
    const contributions = await this.prisma.investmentContribution.findMany({
      where: {
        userId,
        deletedAt: null,
      },
      orderBy: [
        {
          contributedAt: 'desc',
        },
      ],
    });

    return contributions.map(InvestmentMapper.toContributionEntity);
  }

  async upsertContribution(
    data: UpsertInvestmentContributionData,
  ): Promise<InvestmentContributionEntity> {
    const contribution = await this.prisma.investmentContribution.create({
      data: {
        userId: data.userId,
        amount: new Prisma.Decimal(data.amount),
        contributedAt: data.contributedAt,
        month: data.month,
        year: data.year,
        selicAnnualRatePercent: new Prisma.Decimal(data.selicAnnualRatePercent),
        selicReferenceDate: data.selicReferenceDate,
      },
    });

    return InvestmentMapper.toContributionEntity(contribution);
  }

  async setContributionSelicRate(
    data: SetContributionSelicRateData,
  ): Promise<InvestmentContributionEntity> {
    const contribution = await this.prisma.investmentContribution.update({
      where: {
        id: data.contributionId,
        userId: data.userId,
      },
      data: {
        selicAnnualRatePercent: new Prisma.Decimal(data.selicAnnualRatePercent),
        selicReferenceDate: data.selicReferenceDate,
      },
    });

    return InvestmentMapper.toContributionEntity(contribution);
  }

  async softDeleteContribution(userId: string, contributionId: string): Promise<boolean> {
    const result = await this.prisma.investmentContribution.updateMany({
      where: {
        id: contributionId,
        userId,
        deletedAt: null,
      },
      data: {
        deletedAt: new Date(),
      },
    });

    return result.count > 0;
  }
}
