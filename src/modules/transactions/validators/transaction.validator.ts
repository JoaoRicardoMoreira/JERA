import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
  UnprocessableEntityException,
} from '@nestjs/common';

import { TransactionType } from '../entities/transaction-type.enum';
import { TransactionEntity } from '../entities/transaction.entity';
import { TransactionCategoryReference } from '../interfaces/transaction-repository.interface';

@Injectable()
export class TransactionValidator {
  ensureAuthenticatedUserId(userId: string | undefined): string {
    if (!userId) {
      throw new UnauthorizedException({
        code: 'AUTHENTICATION_REQUIRED',
        message: 'Usuario autenticado nao encontrado no contexto da requisicao.',
      });
    }

    return userId;
  }

  ensureTransactionDeleted(wasDeleted: boolean): void {
    if (!wasDeleted) {
      throw new NotFoundException({
        code: 'TRANSACTION_NOT_FOUND',
        message: 'Transacao nao encontrada para o usuario autenticado.',
      });
    }
  }

  ensureTransactionFound(transaction: TransactionEntity | null): TransactionEntity {
    if (!transaction) {
      throw new NotFoundException({
        code: 'TRANSACTION_NOT_FOUND',
        message: 'Transacao nao encontrada para o usuario autenticado.',
      });
    }

    return transaction;
  }

  ensureCategoryMatchesTransactionType(
    category: TransactionCategoryReference | null,
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
        code: 'CATEGORY_TYPE_MISMATCH',
        message: 'Categoria informada nao corresponde ao tipo da transacao.',
      });
    }
  }
}
