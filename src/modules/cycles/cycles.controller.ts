import { Controller, Get, Post, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Permissions } from '../../common/decorators/permissions.decorator';
import { RequestUser } from '../../common/interfaces/request-user.interface';
import { Permission } from '../auth/entities/permission.enum';
import { CycleQueryDto } from './dto/cycle.dto';
import { CyclesService } from './cycles.service';

@ApiTags('Cycles')
@ApiBearerAuth()
@Controller('cycles')
export class CyclesController {
  constructor(private readonly service: CyclesService) {}

  @Get('overview')
  @Permissions(Permission.DASHBOARD_READ)
  @ApiOperation({ summary: 'Retorna o mapa financeiro e o ritual do ciclo.' })
  overview(@CurrentUser() user: RequestUser, @Query() query: CycleQueryDto) {
    return this.service.getOverview(user.id, query);
  }

  @Post('review')
  @Permissions(Permission.DASHBOARD_READ)
  @ApiOperation({ summary: 'Registra a conclusão do ritual do ciclo.' })
  review(@CurrentUser() user: RequestUser, @Query() query: CycleQueryDto) {
    return this.service.reviewCycle(user.id, query);
  }
}
