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
  Query,
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
import { CreateExpenseDto } from './dto/create-expense.dto';
import { CreateIncomeDto } from './dto/create-income.dto';
import { TransactionQueryDto } from './dto/transaction-query.dto';
import { TransactionResponseDto } from './dto/transaction-response.dto';
import { TransactionsService } from './transactions.service';
import { TransactionValidator } from './validators/transaction.validator';

@ApiTags('Transactions')
@ApiBearerAuth()
@Controller('transactions')
export class TransactionsController {
  constructor(
    private readonly transactionsService: TransactionsService,
    private readonly transactionValidator: TransactionValidator,
  ) {}

  @Post('expense')
  @Permissions(Permission.TRANSACTIONS_CREATE)
  @ApiOperation({
    summary: 'Cria uma despesa para o usuario autenticado.',
    description: 'Endpoint BFF para o fluxo de registro de despesas da interface.',
  })
  @ApiCreatedResponse({ type: TransactionResponseDto })
  @ApiBadRequestResponse({ description: 'Payload invalido ou fora das regras de validacao.' })
  @ApiUnauthorizedResponse({ description: 'JWT ausente, invalido ou usuario sem contexto.' })
  @ApiForbiddenResponse({ description: 'Usuario autenticado sem permissao para criar transacoes.' })
  @ApiNotFoundResponse({ description: 'Categoria nao encontrada no escopo do usuario.' })
  @ApiUnprocessableEntityResponse({ description: 'Categoria nao corresponde a uma despesa.' })
  async createExpense(
    @CurrentUser() user: RequestUser | undefined,
    @Body() dto: CreateExpenseDto,
  ): Promise<TransactionResponseDto> {
    const userId = this.transactionValidator.ensureAuthenticatedUserId(user?.id);

    return this.transactionsService.createExpense(userId, dto);
  }

  @Post('income')
  @Permissions(Permission.TRANSACTIONS_CREATE)
  @ApiOperation({
    summary: 'Cria uma receita para o usuario autenticado.',
    description: 'Endpoint BFF para o fluxo de registro de receitas da interface.',
  })
  @ApiCreatedResponse({ type: TransactionResponseDto })
  @ApiBadRequestResponse({ description: 'Payload invalido ou fora das regras de validacao.' })
  @ApiUnauthorizedResponse({ description: 'JWT ausente, invalido ou usuario sem contexto.' })
  @ApiForbiddenResponse({ description: 'Usuario autenticado sem permissao para criar transacoes.' })
  @ApiNotFoundResponse({ description: 'Categoria nao encontrada no escopo do usuario.' })
  @ApiUnprocessableEntityResponse({ description: 'Categoria nao corresponde a uma receita.' })
  async createIncome(
    @CurrentUser() user: RequestUser | undefined,
    @Body() dto: CreateIncomeDto,
  ): Promise<TransactionResponseDto> {
    const userId = this.transactionValidator.ensureAuthenticatedUserId(user?.id);

    return this.transactionsService.createIncome(userId, dto);
  }

  @Get('history')
  @Permissions(Permission.TRANSACTIONS_READ)
  @ApiOperation({
    summary: 'Lista historico mensal de transacoes.',
    description: 'Filtra transacoes ativas por usuario, mes, ano e tipo opcional.',
  })
  @ApiOkResponse({ type: TransactionResponseDto, isArray: true })
  @ApiBadRequestResponse({ description: 'Query string invalida ou fora das regras de validacao.' })
  @ApiUnauthorizedResponse({ description: 'JWT ausente, invalido ou usuario sem contexto.' })
  @ApiForbiddenResponse({ description: 'Usuario autenticado sem permissao para ler transacoes.' })
  async getHistory(
    @CurrentUser() user: RequestUser | undefined,
    @Query() query: TransactionQueryDto,
  ) {
    const userId = this.transactionValidator.ensureAuthenticatedUserId(user?.id);

    return this.transactionsService.getHistory(userId, query);
  }

  @Delete(':id')
  @Permissions(Permission.TRANSACTIONS_DELETE)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: 'Exclui uma transacao via soft delete.',
    description: 'Preenche deletedAt sem remover fisicamente o registro do banco.',
  })
  @ApiParam({
    name: 'id',
    format: 'uuid',
    example: '7f923c74-4c4b-4798-a5cf-d4098d561d70',
  })
  @ApiNoContentResponse({ description: 'Transacao excluida com sucesso.' })
  @ApiBadRequestResponse({ description: 'Parametro `id` invalido; esperado UUID.' })
  @ApiUnauthorizedResponse({ description: 'JWT ausente, invalido ou usuario sem contexto.' })
  @ApiForbiddenResponse({
    description: 'Usuario autenticado sem permissao para excluir transacoes.',
  })
  @ApiNotFoundResponse({ description: 'Transacao nao encontrada no escopo do usuario.' })
  async deleteTransaction(
    @CurrentUser() user: RequestUser | undefined,
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<void> {
    const userId = this.transactionValidator.ensureAuthenticatedUserId(user?.id);

    await this.transactionsService.deleteTransaction(userId, id);
  }
}
