import { Body, Controller, Get, Param, ParseUUIDPipe, Patch, Post, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Permissions } from '../../common/decorators/permissions.decorator';
import { RequestUser } from '../../common/interfaces/request-user.interface';
import { Permission } from '../auth/entities/permission.enum';
import { CreatePayableDto, PayableQueryDto } from './dto/payable.dto';
import { PayablesService } from './payables.service';

@ApiTags('Payables')
@ApiBearerAuth()
@Controller('payables')
export class PayablesController {
  constructor(private readonly service: PayablesService) {}

  @Get()
  @Permissions(Permission.PAYABLES_MANAGE)
  list(@CurrentUser() user: RequestUser, @Query() query: PayableQueryDto) {
    return this.service.list(user.id, query);
  }

  @Post()
  @Permissions(Permission.PAYABLES_MANAGE)
  create(@CurrentUser() user: RequestUser, @Body() dto: CreatePayableDto) {
    return this.service.create(user.id, dto);
  }

  @Post('generate')
  @Permissions(Permission.PAYABLES_MANAGE)
  generate(@CurrentUser() user: RequestUser, @Body() dto: PayableQueryDto) {
    return this.service.generateForPeriod(user.id, dto);
  }

  @Patch(':id/pay')
  @Permissions(Permission.PAYABLES_MANAGE)
  pay(@CurrentUser() user: RequestUser, @Param('id', ParseUUIDPipe) id: string) {
    return this.service.markPaid(user.id, id);
  }
}
