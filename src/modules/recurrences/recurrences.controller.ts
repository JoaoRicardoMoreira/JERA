import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Post,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
  ApiUnauthorizedResponse,
  ApiUnprocessableEntityResponse,
} from '@nestjs/swagger';

import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Permissions } from '../../common/decorators/permissions.decorator';
import { RequestUser } from '../../common/interfaces/request-user.interface';
import { Permission } from '../auth/entities/permission.enum';
import { CreateRecurrenceDto } from './dto/create-recurrence.dto';
import { ProcessRecurrencesDto } from './dto/process-recurrences.dto';
import { ProcessRecurrencesResponseDto } from './dto/process-recurrences-response.dto';
import { RecurrenceResponseDto } from './dto/recurrence-response.dto';
import { RecurrencesService } from './recurrences.service';
import { RecurrenceValidator } from './validators/recurrence.validator';

@ApiTags('Recurrences')
@ApiBearerAuth()
@Controller('recurrences')
export class RecurrencesController {
  constructor(
    private readonly recurrencesService: RecurrencesService,
    private readonly recurrenceValidator: RecurrenceValidator,
  ) {}

  @Post()
  @Permissions(Permission.RECURRENCES_MANAGE)
  @ApiOperation({
    summary: 'Cria uma recorrencia para o usuario autenticado.',
    description: 'Endpoint BFF para configurar transacoes recorrentes da interface.',
  })
  @ApiCreatedResponse({ type: RecurrenceResponseDto })
  @ApiBadRequestResponse({ description: 'Payload invalido ou fora das regras de validacao.' })
  @ApiUnauthorizedResponse({ description: 'JWT ausente, invalido ou usuario sem contexto.' })
  @ApiForbiddenResponse({
    description: 'Usuario autenticado sem permissao para gerenciar recorrencias.',
  })
  @ApiNotFoundResponse({ description: 'Categoria nao encontrada no escopo do usuario.' })
  @ApiUnprocessableEntityResponse({
    description: 'Categoria nao corresponde ao tipo ou periodo da recorrencia e invalido.',
  })
  async createRecurrence(
    @CurrentUser() user: RequestUser | undefined,
    @Body() dto: CreateRecurrenceDto,
  ): Promise<RecurrenceResponseDto> {
    const userId = this.recurrenceValidator.ensureAuthenticatedUserId(user?.id);

    return this.recurrencesService.createRecurrence(userId, dto);
  }

  @Get()
  @Permissions(Permission.RECURRENCES_MANAGE)
  @ApiOperation({
    summary: 'Lista recorrencias ativas.',
    description: 'Retorna apenas recorrencias ativas e nao excluidas do usuario autenticado.',
  })
  @ApiOkResponse({ type: RecurrenceResponseDto, isArray: true })
  @ApiUnauthorizedResponse({ description: 'JWT ausente, invalido ou usuario sem contexto.' })
  @ApiForbiddenResponse({
    description: 'Usuario autenticado sem permissao para gerenciar recorrencias.',
  })
  async listActiveRecurrences(
    @CurrentUser() user: RequestUser | undefined,
  ): Promise<RecurrenceResponseDto[]> {
    const userId = this.recurrenceValidator.ensureAuthenticatedUserId(user?.id);

    return this.recurrencesService.listActiveRecurrences(userId);
  }

  @Post('process')
  @Permissions(Permission.RECURRENCES_MANAGE)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Processa recorrencias por periodo.',
    description:
      'Gera transacoes para recorrencias ativas no mes solicitado sem duplicar execucoes do mesmo periodo.',
  })
  @ApiOkResponse({ type: ProcessRecurrencesResponseDto })
  @ApiBadRequestResponse({ description: 'Payload invalido ou fora das regras de validacao.' })
  @ApiUnauthorizedResponse({ description: 'JWT ausente, invalido ou usuario sem contexto.' })
  @ApiForbiddenResponse({
    description: 'Usuario autenticado sem permissao para gerenciar recorrencias.',
  })
  async processRecurrences(
    @CurrentUser() user: RequestUser | undefined,
    @Body() dto: ProcessRecurrencesDto,
  ): Promise<ProcessRecurrencesResponseDto> {
    const userId = this.recurrenceValidator.ensureAuthenticatedUserId(user?.id);

    return this.recurrencesService.processRecurrences(userId, dto);
  }

  @Delete(':id')
  @Permissions(Permission.RECURRENCES_MANAGE)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: 'Exclui uma recorrencia via soft delete.',
    description: 'Preenche deletedAt sem remover fisicamente o registro do banco.',
  })
  @ApiParam({
    name: 'id',
    format: 'uuid',
    example: '7f923c74-4c4b-4798-a5cf-d4098d561d70',
  })
  @ApiNoContentResponse({ description: 'Recorrencia excluida com sucesso.' })
  @ApiBadRequestResponse({ description: 'Parametro `id` invalido; esperado UUID.' })
  @ApiUnauthorizedResponse({ description: 'JWT ausente, invalido ou usuario sem contexto.' })
  @ApiForbiddenResponse({
    description: 'Usuario autenticado sem permissao para gerenciar recorrencias.',
  })
  @ApiNotFoundResponse({ description: 'Recorrencia nao encontrada no escopo do usuario.' })
  async deleteRecurrence(
    @CurrentUser() user: RequestUser | undefined,
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<void> {
    const userId = this.recurrenceValidator.ensureAuthenticatedUserId(user?.id);

    await this.recurrencesService.deleteRecurrence(userId, id);
  }
}
