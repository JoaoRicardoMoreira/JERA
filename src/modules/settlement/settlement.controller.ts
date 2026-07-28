import { Controller, Get, UnauthorizedException } from '@nestjs/common';
import {
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
import { SettlementOverviewDto } from './dto/settlement-overview.dto';
import { SettlementService } from './settlement.service';

@ApiTags('Settlement')
@ApiBearerAuth()
@Controller('settlement')
export class SettlementController {
  constructor(private readonly settlementService: SettlementService) {}

  @Get('overview')
  @Permissions(Permission.SETTLEMENT_READ)
  @ApiOperation({
    summary: 'Retorna o assentamento financeiro do usuário.',
    description:
      'Reconstrói a jornada de forma idempotente e apresenta estágio, distritos, atmosfera e jornadas do ciclo.',
  })
  @ApiOkResponse({ type: SettlementOverviewDto })
  @ApiUnauthorizedResponse({ description: 'JWT ausente ou inválido.' })
  @ApiForbiddenResponse({ description: 'Usuário sem permissão para acessar o assentamento.' })
  getOverview(@CurrentUser() user: RequestUser | undefined): Promise<SettlementOverviewDto> {
    const userId = user?.id;
    if (!userId) throw new UnauthorizedException('Usuário autenticado não encontrado.');
    return this.settlementService.getOverview(userId);
  }
}
