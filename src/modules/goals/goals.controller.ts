import { Body, Controller, Get, Put, Query } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
  ApiUnprocessableEntityResponse,
} from '@nestjs/swagger';

import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Permissions } from '../../common/decorators/permissions.decorator';
import { RequestUser } from '../../common/interfaces/request-user.interface';
import { Permission } from '../auth/entities/permission.enum';
import { GoalQueryDto } from './dto/goal-query.dto';
import { GoalResponseDto } from './dto/goal-response.dto';
import { UpsertGoalDto } from './dto/upsert-goal.dto';
import { GoalsService } from './goals.service';
import { GoalValidator } from './validators/goal.validator';

@ApiTags('Goals')
@ApiBearerAuth()
@Controller('budgets')
export class GoalsController {
  constructor(
    private readonly goalsService: GoalsService,
    private readonly goalValidator: GoalValidator,
  ) {}

  @Put()
  @Permissions(Permission.GOALS_MANAGE)
  @ApiOperation({
    summary: 'Cria ou atualiza uma meta mensal por categoria.',
    description:
      'Endpoint BFF para configurar meta de despesa por categoria e periodo da interface.',
  })
  @ApiOkResponse({ type: GoalResponseDto })
  @ApiBadRequestResponse({ description: 'Payload invalido ou fora das regras de validacao.' })
  @ApiUnauthorizedResponse({ description: 'JWT ausente, invalido ou usuario sem contexto.' })
  @ApiForbiddenResponse({ description: 'Usuario autenticado sem permissao para gerenciar metas.' })
  @ApiNotFoundResponse({ description: 'Categoria nao encontrada no escopo do usuario.' })
  @ApiUnprocessableEntityResponse({ description: 'Categoria nao corresponde a uma despesa.' })
  async upsertGoal(
    @CurrentUser() user: RequestUser | undefined,
    @Body() dto: UpsertGoalDto,
  ): Promise<GoalResponseDto> {
    const userId = this.goalValidator.ensureAuthenticatedUserId(user?.id);

    return this.goalsService.upsertGoal(userId, dto);
  }

  @Get()
  @Permissions(Permission.GOALS_MANAGE)
  @ApiOperation({
    summary: 'Lista metas mensais por periodo.',
    description:
      'Retorna metas ativas do usuario autenticado com progresso calculado por categoria.',
  })
  @ApiOkResponse({ type: GoalResponseDto, isArray: true })
  @ApiBadRequestResponse({ description: 'Query string invalida ou fora das regras de validacao.' })
  @ApiUnauthorizedResponse({ description: 'JWT ausente, invalido ou usuario sem contexto.' })
  @ApiForbiddenResponse({ description: 'Usuario autenticado sem permissao para gerenciar metas.' })
  async getGoalsByPeriod(
    @CurrentUser() user: RequestUser | undefined,
    @Query() query: GoalQueryDto,
  ): Promise<GoalResponseDto[]> {
    const userId = this.goalValidator.ensureAuthenticatedUserId(user?.id);

    return this.goalsService.getGoalsByPeriod(userId, query);
  }
}
