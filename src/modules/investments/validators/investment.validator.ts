import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';

@Injectable()
export class InvestmentValidator {
  ensureAuthenticatedUserId(userId: string | undefined): string {
    if (!userId) {
      throw new UnauthorizedException({
        code: 'AUTHENTICATION_REQUIRED',
        message: 'Usuario autenticado nao encontrado no contexto da requisicao.',
      });
    }

    return userId;
  }

  ensureContributionDeleted(wasDeleted: boolean): void {
    if (!wasDeleted) {
      throw new NotFoundException({
        code: 'INVESTMENT_CONTRIBUTION_NOT_FOUND',
        message: 'Aporte nao encontrado para o usuario autenticado.',
      });
    }
  }

  ensureContributionDateIsNotFuture(contributedAt: Date, now = new Date()): void {
    const contributionDay = Date.UTC(
      contributedAt.getUTCFullYear(),
      contributedAt.getUTCMonth(),
      contributedAt.getUTCDate(),
    );
    const currentDay = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate());

    if (contributionDay > currentDay) {
      throw new BadRequestException({
        code: 'FUTURE_INVESTMENT_CONTRIBUTION',
        message: 'A data do aporte nao pode estar no futuro.',
      });
    }
  }
}
