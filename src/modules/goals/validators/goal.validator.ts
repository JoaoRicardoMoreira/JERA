import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { TransactionType } from '@prisma/client';

import { GoalCategoryReference } from '../interfaces/goal-repository.interface';

@Injectable()
export class GoalValidator {
  ensureAuthenticatedUserId(userId: string | undefined): string {
    if (!userId) {
      throw new UnauthorizedException({
        code: 'AUTHENTICATION_REQUIRED',
        message: 'Usuario autenticado nao encontrado no contexto da requisicao.',
      });
    }

    return userId;
  }

  ensureExpenseCategory(category: GoalCategoryReference | null): void {
    if (!category) {
      throw new NotFoundException({
        code: 'CATEGORY_NOT_FOUND',
        message: 'Categoria nao encontrada para o usuario autenticado.',
      });
    }

    if (category.type !== TransactionType.EXPENSE) {
      throw new UnprocessableEntityException({
        code: 'GOAL_CATEGORY_TYPE_MISMATCH',
        message: 'Metas devem ser associadas a categorias de despesa.',
      });
    }
  }
}
