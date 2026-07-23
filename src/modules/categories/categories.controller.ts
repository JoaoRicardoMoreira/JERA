import { Controller, Get } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { RequestUser } from '../../common/interfaces/request-user.interface';
import { CategoriesService } from './categories.service';
import { CategoryResponseDto } from './dto/category-response.dto';
import { CategoryValidator } from './validators/category.validator';

@ApiTags('Categories')
@Controller('categories')
export class CategoriesController {
  constructor(
    private readonly categoriesService: CategoriesService,
    private readonly categoryValidator: CategoryValidator,
  ) {}

  @Get()
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Lista categorias financeiras do usuario autenticado.',
    description:
      'Endpoint protegido por JWT. Retorna apenas categorias ativas pertencentes ao usuario autenticado.',
  })
  @ApiOkResponse({ type: CategoryResponseDto, isArray: true })
  @ApiUnauthorizedResponse({ description: 'JWT ausente, invalido ou usuario sem contexto.' })
  async listCategories(@CurrentUser() user?: RequestUser): Promise<CategoryResponseDto[]> {
    const userId = this.categoryValidator.ensureAuthenticatedUserId(user?.id);

    return this.categoriesService.listByUser(userId);
  }
}
