import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Permissions } from '../../common/decorators/permissions.decorator';
import { RequestUser } from '../../common/interfaces/request-user.interface';
import { Permission } from '../auth/entities/permission.enum';
import {
  CreateFinancialGoalContributionDto,
  CreateFinancialGoalDto,
  UpdateFinancialGoalDto,
} from './dto/financial-goal.dto';
import { FinancialGoalsService } from './financial-goals.service';

@ApiTags('Financial goals')
@ApiBearerAuth()
@Controller('goals')
export class FinancialGoalsController {
  constructor(private readonly service: FinancialGoalsService) {}

  @Get()
  @Permissions(Permission.FINANCIAL_GOALS_MANAGE)
  list(@CurrentUser() user: RequestUser) {
    return this.service.list(user.id);
  }

  @Post()
  @Permissions(Permission.FINANCIAL_GOALS_MANAGE)
  create(@CurrentUser() user: RequestUser, @Body() dto: CreateFinancialGoalDto) {
    return this.service.create(user.id, dto);
  }

  @Get(':id/contributions')
  @Permissions(Permission.FINANCIAL_GOALS_MANAGE)
  listContributions(@CurrentUser() user: RequestUser, @Param('id', ParseUUIDPipe) id: string) {
    return this.service.listContributions(user.id, id);
  }

  @Post(':id/contributions')
  @Permissions(Permission.FINANCIAL_GOALS_MANAGE)
  contribute(
    @CurrentUser() user: RequestUser,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: CreateFinancialGoalContributionDto,
  ) {
    return this.service.contribute(user.id, id, dto);
  }

  @Patch(':id')
  @Permissions(Permission.FINANCIAL_GOALS_MANAGE)
  update(
    @CurrentUser() user: RequestUser,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateFinancialGoalDto,
  ) {
    return this.service.update(user.id, id, dto);
  }

  @Delete(':id')
  @HttpCode(204)
  @Permissions(Permission.FINANCIAL_GOALS_MANAGE)
  remove(@CurrentUser() user: RequestUser, @Param('id', ParseUUIDPipe) id: string) {
    return this.service.remove(user.id, id);
  }
}
