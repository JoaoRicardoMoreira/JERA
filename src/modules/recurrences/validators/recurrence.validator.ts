import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
  UnprocessableEntityException,
} from '@nestjs/common';

import { TransactionType } from '../../transactions/entities/transaction-type.enum';
import { RecurrenceCategoryReference } from '../interfaces/recurrence-repository.interface';

@Injectable()
export class RecurrenceValidator {
  ensureAuthenticatedUserId(userId: string | undefined): string {
    if (!userId) {
      throw new UnauthorizedException({
        code: 'AUTHENTICATION_REQUIRED',
        message: 'Usuario autenticado nao encontrado no contexto da requisicao.',
      });
    }

    return userId;
  }

  ensureCategoryMatchesTransactionType(
    category: RecurrenceCategoryReference | null,
    expectedType: TransactionType,
  ): void {
    if (!category) {
      throw new NotFoundException({
        code: 'CATEGORY_NOT_FOUND',
        message: 'Categoria nao encontrada para o usuario autenticado.',
      });
    }

    if (category.type !== expectedType) {
      throw new UnprocessableEntityException({
        code: 'RECURRENCE_CATEGORY_TYPE_MISMATCH',
        message: 'Categoria informada nao corresponde ao tipo da recorrencia.',
      });
    }
  }

  ensureValidPeriod(startDate: Date, endDate?: Date): void {
    if (Number.isNaN(startDate.getTime())) {
      throw new BadRequestException({
        code: 'INVALID_RECURRENCE_START_DATE',
        message: 'Data inicial da recorrencia e invalida.',
      });
    }

    if (!endDate) {
      return;
    }

    if (Number.isNaN(endDate.getTime())) {
      throw new BadRequestException({
        code: 'INVALID_RECURRENCE_END_DATE',
        message: 'Data final da recorrencia e invalida.',
      });
    }

    if (endDate < startDate) {
      throw new UnprocessableEntityException({
        code: 'RECURRENCE_END_DATE_BEFORE_START_DATE',
        message: 'Data final da recorrencia deve ser maior ou igual a data inicial.',
      });
    }
  }

  ensureRecurrenceDeleted(wasDeleted: boolean): void {
    if (!wasDeleted) {
      throw new NotFoundException({
        code: 'RECURRENCE_NOT_FOUND',
        message: 'Recorrencia nao encontrada para o usuario autenticado.',
      });
    }
  }
}
