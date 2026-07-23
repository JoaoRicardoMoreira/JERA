import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Put,
  Query,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiForbiddenResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Permissions } from '../../common/decorators/permissions.decorator';
import { RequestUser } from '../../common/interfaces/request-user.interface';
import { Permission } from '../auth/entities/permission.enum';
import { InvestmentQueryDto } from './dto/investment-query.dto';
import {
  InvestmentContributionResponseDto,
  InvestmentOverviewResponseDto,
} from './dto/investment-response.dto';
import { UpsertInvestmentConfigDto } from './dto/upsert-investment-config.dto';
import { UpsertInvestmentContributionDto } from './dto/upsert-investment-contribution.dto';
import { InvestmentsService } from './investments.service';
import { InvestmentValidator } from './validators/investment.validator';

@ApiTags('Investments')
@ApiBearerAuth()
@Controller('investments')
export class InvestmentsController {
  constructor(
    private readonly investmentsService: InvestmentsService,
    private readonly investmentValidator: InvestmentValidator,
  ) {}

  @Get('overview')
  @Permissions(Permission.INVESTMENTS_READ)
  @ApiOperation({
    summary: 'Carrega o painel de investimentos.',
    description:
      'Retorna taxa, aportes, aporte do periodo e evolucao patrimonial para a interface deep dark.',
  })
  @ApiOkResponse({ type: InvestmentOverviewResponseDto })
  @ApiBadRequestResponse({ description: 'Query string invalida ou fora das regras de validacao.' })
  @ApiUnauthorizedResponse({ description: 'JWT ausente, invalido ou usuario sem contexto.' })
  @ApiForbiddenResponse({
    description: 'Usuario autenticado sem permissao para ler investimentos.',
  })
  async getOverview(
    @CurrentUser() user: RequestUser | undefined,
    @Query() query: InvestmentQueryDto,
  ): Promise<InvestmentOverviewResponseDto> {
    const userId = this.investmentValidator.ensureAuthenticatedUserId(user?.id);

    return this.investmentsService.getOverview(userId, query);
  }

  @Put('config')
  @Permissions(Permission.INVESTMENTS_MANAGE)
  @ApiOperation({
    summary: 'Atualiza a taxa mensal de rendimento.',
    description: 'Persistencia da configuracao usada no painel de investimentos.',
  })
  @ApiOkResponse({ type: InvestmentOverviewResponseDto })
  @ApiBadRequestResponse({ description: 'Payload invalido ou fora das regras de validacao.' })
  @ApiUnauthorizedResponse({ description: 'JWT ausente, invalido ou usuario sem contexto.' })
  @ApiForbiddenResponse({
    description: 'Usuario autenticado sem permissao para gerenciar investimentos.',
  })
  async updateConfig(
    @CurrentUser() user: RequestUser | undefined,
    @Body() dto: UpsertInvestmentConfigDto,
  ): Promise<InvestmentOverviewResponseDto> {
    const userId = this.investmentValidator.ensureAuthenticatedUserId(user?.id);

    return this.investmentsService.updateConfig(userId, dto);
  }

  @Put('contributions')
  @Permissions(Permission.INVESTMENTS_MANAGE)
  @ApiOperation({
    summary: 'Cria ou atualiza o aporte de um mes.',
    description: 'Mantem um unico aporte por usuario, mes e ano.',
  })
  @ApiOkResponse({ type: InvestmentContributionResponseDto })
  @ApiBadRequestResponse({ description: 'Payload invalido ou fora das regras de validacao.' })
  @ApiUnauthorizedResponse({ description: 'JWT ausente, invalido ou usuario sem contexto.' })
  @ApiForbiddenResponse({
    description: 'Usuario autenticado sem permissao para gerenciar investimentos.',
  })
  async upsertContribution(
    @CurrentUser() user: RequestUser | undefined,
    @Body() dto: UpsertInvestmentContributionDto,
  ): Promise<InvestmentContributionResponseDto> {
    const userId = this.investmentValidator.ensureAuthenticatedUserId(user?.id);

    return this.investmentsService.upsertContribution(userId, dto);
  }

  @Delete('contributions/:id')
  @Permissions(Permission.INVESTMENTS_MANAGE)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: 'Exclui um aporte via soft delete.',
    description: 'Remove visualmente um aporte sem apagar fisicamente o registro.',
  })
  @ApiParam({
    name: 'id',
    format: 'uuid',
    example: '7f923c74-4c4b-4798-a5cf-d4098d561d70',
  })
  @ApiNoContentResponse({ description: 'Aporte excluido com sucesso.' })
  @ApiBadRequestResponse({ description: 'Parametro `id` invalido; esperado UUID.' })
  @ApiUnauthorizedResponse({ description: 'JWT ausente, invalido ou usuario sem contexto.' })
  @ApiForbiddenResponse({
    description: 'Usuario autenticado sem permissao para gerenciar investimentos.',
  })
  @ApiNotFoundResponse({ description: 'Aporte nao encontrado no escopo do usuario.' })
  async deleteContribution(
    @CurrentUser() user: RequestUser | undefined,
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<void> {
    const userId = this.investmentValidator.ensureAuthenticatedUserId(user?.id);

    await this.investmentsService.deleteContribution(userId, id);
  }
}
