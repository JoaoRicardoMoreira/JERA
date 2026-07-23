import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Query,
  Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiForbiddenResponse,
  ApiOkResponse,
  ApiOperation,
  ApiProduces,
  ApiTags,
  ApiTooManyRequestsResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';
import { Response } from 'express';

import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Permissions } from '../../common/decorators/permissions.decorator';
import { RequestUser } from '../../common/interfaces/request-user.interface';
import { Permission } from '../auth/entities/permission.enum';
import { ExportCsvQueryDto } from './dto/export-csv-query.dto';
import { ImportCsvResponseDto } from './dto/import-csv-response.dto';
import { ImportExportService } from './import-export.service';
import { UploadedCsvFile } from './interfaces/csv-row.interface';
import { CsvValidator } from './validators/csv.validator';

@ApiTags('ImportExport')
@ApiBearerAuth()
@Controller('import-export')
export class ImportExportController {
  constructor(
    private readonly importExportService: ImportExportService,
    private readonly csvValidator: CsvValidator,
  ) {}

  @Get('csv/export')
  @Permissions(Permission.TRANSACTIONS_READ)
  @ApiOperation({
    summary: 'Exporta transacoes em CSV.',
    description: 'Retorna CSV com transacoes ativas do usuario autenticado.',
  })
  @ApiProduces('text/csv')
  @ApiOkResponse({ description: 'Arquivo CSV gerado com sucesso.' })
  @ApiBadRequestResponse({ description: 'Query string invalida ou fora das regras de validacao.' })
  @ApiUnauthorizedResponse({ description: 'JWT ausente, invalido ou usuario sem contexto.' })
  @ApiForbiddenResponse({ description: 'Usuario autenticado sem permissao para exportar CSV.' })
  @ApiTooManyRequestsResponse({ description: 'Limite de exportacoes excedido.' })
  @Throttle({ default: { limit: 20, ttl: 60_000 } })
  async exportCsv(
    @CurrentUser() user: RequestUser | undefined,
    @Query() query: ExportCsvQueryDto,
    @Res() response: Response,
  ): Promise<void> {
    const userId = this.csvValidator.ensureAuthenticatedUserId(user?.id);
    const csv = await this.importExportService.exportCsv(userId, query);

    response.setHeader('Content-Type', 'text/csv; charset=utf-8');
    response.setHeader('Content-Disposition', 'attachment; filename="transactions.csv"');
    response.status(HttpStatus.OK).send(csv);
  }

  @Post('csv/import')
  @Permissions(Permission.TRANSACTIONS_CREATE)
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(FileInterceptor('file'))
  @ApiOperation({
    summary: 'Importa transacoes por CSV.',
    description: 'Valida o CSV inteiro antes de persistir transacoes para o usuario autenticado.',
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      required: ['file'],
      properties: {
        file: {
          type: 'string',
          format: 'binary',
          description: 'CSV com cabecalho type,amount,occurredAt,description,categoryId.',
        },
      },
    },
  })
  @ApiOkResponse({ type: ImportCsvResponseDto })
  @ApiBadRequestResponse({ description: 'Arquivo CSV ausente, invalido ou malformado.' })
  @ApiUnauthorizedResponse({ description: 'JWT ausente, invalido ou usuario sem contexto.' })
  @ApiForbiddenResponse({ description: 'Usuario autenticado sem permissao para importar CSV.' })
  @ApiTooManyRequestsResponse({ description: 'Limite de importacoes excedido.' })
  @Throttle({ default: { limit: 10, ttl: 60_000 } })
  async importCsv(
    @CurrentUser() user: RequestUser | undefined,
    @UploadedFile() file: UploadedCsvFile | undefined,
  ): Promise<ImportCsvResponseDto> {
    const userId = this.csvValidator.ensureAuthenticatedUserId(user?.id);

    return this.importExportService.importCsv(userId, file);
  }
}
