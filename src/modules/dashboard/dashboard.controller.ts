import { Controller, Get, Query } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiForbiddenResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Permissions } from '../../common/decorators/permissions.decorator';
import { RequestUser } from '../../common/interfaces/request-user.interface';
import { Permission } from '../auth/entities/permission.enum';
import { ChartsResponseDto } from './dto/charts-response.dto';
import { DashboardQueryDto } from './dto/dashboard-query.dto';
import { MonthlySummaryResponseDto } from './dto/monthly-summary-response.dto';
import { DashboardServiceImpl } from './dashboard.service';
import { DashboardValidator } from './validators/dashboard.validator';

@ApiTags('Dashboard')
@ApiBearerAuth()
@Controller('dashboard')
export class DashboardController {
  constructor(
    private readonly dashboardService: DashboardServiceImpl,
    private readonly dashboardValidator: DashboardValidator,
  ) {}

  @Get('monthly-summary')
  @Permissions(Permission.DASHBOARD_READ)
  @ApiOperation({
    summary: 'Retorna resumo financeiro mensal.',
    description:
      'Endpoint BFF para a tela principal, agregando receitas, despesas, saldo e metas do periodo.',
  })
  @ApiOkResponse({ type: MonthlySummaryResponseDto })
  @ApiBadRequestResponse({ description: 'Query string invalida ou fora das regras de validacao.' })
  @ApiUnauthorizedResponse({ description: 'JWT ausente, invalido ou usuario sem contexto.' })
  @ApiForbiddenResponse({ description: 'Usuario autenticado sem permissao para ler dashboard.' })
  async getMonthlySummary(
    @CurrentUser() user: RequestUser | undefined,
    @Query() query: DashboardQueryDto,
  ): Promise<MonthlySummaryResponseDto> {
    const userId = this.dashboardValidator.ensureAuthenticatedUserId(user?.id);

    return this.dashboardService.getMonthlySummary(userId, query);
  }

  @Get('charts')
  @Permissions(Permission.DASHBOARD_READ)
  @ApiOperation({
    summary: 'Retorna dados agregados para graficos.',
    description:
      'Endpoint BFF para graficos de gastos por categoria e progresso de metas por categoria.',
  })
  @ApiOkResponse({ type: ChartsResponseDto })
  @ApiBadRequestResponse({ description: 'Query string invalida ou fora das regras de validacao.' })
  @ApiUnauthorizedResponse({ description: 'JWT ausente, invalido ou usuario sem contexto.' })
  @ApiForbiddenResponse({ description: 'Usuario autenticado sem permissao para ler dashboard.' })
  async getCharts(
    @CurrentUser() user: RequestUser | undefined,
    @Query() query: DashboardQueryDto,
  ): Promise<ChartsResponseDto> {
    const userId = this.dashboardValidator.ensureAuthenticatedUserId(user?.id);

    return this.dashboardService.getCharts(userId, query);
  }
}
