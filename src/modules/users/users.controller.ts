import { Body, Controller, Get, Patch, UnauthorizedException } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBadRequestResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { RequestUser } from '../../common/interfaces/request-user.interface';
import { UserResponseDto } from './dto/user-response.dto';
import { UpdateUserProfileDto } from './dto/update-user-profile.dto';
import { UsersService } from './users.service';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Retorna o perfil do usuario autenticado.',
    description: 'Endpoint protegido por JWT. Retorna o perfil do usuario autenticado.',
  })
  @ApiOkResponse({ type: UserResponseDto })
  @ApiUnauthorizedResponse({ description: 'JWT ausente, invalido ou usuario sem contexto.' })
  async getMe(@CurrentUser() user?: RequestUser): Promise<UserResponseDto> {
    if (!user?.id) {
      throw new UnauthorizedException({
        code: 'AUTHENTICATION_REQUIRED',
        message: 'Usuario autenticado nao encontrado no contexto da requisicao.',
      });
    }

    return this.usersService.getCurrentUser(user.id);
  }

  @Patch('me')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Atualiza o perfil do usuario autenticado.',
    description: 'Atualiza apenas dados pessoais; email e credenciais permanecem inalterados.',
  })
  @ApiOkResponse({ type: UserResponseDto })
  @ApiBadRequestResponse({ description: 'Dados pessoais invalidos.' })
  @ApiUnauthorizedResponse({ description: 'JWT ausente, invalido ou usuario sem contexto.' })
  async updateMe(
    @Body() dto: UpdateUserProfileDto,
    @CurrentUser() user?: RequestUser,
  ): Promise<UserResponseDto> {
    if (!user?.id) {
      throw new UnauthorizedException({
        code: 'AUTHENTICATION_REQUIRED',
        message: 'Usuario autenticado nao encontrado no contexto da requisicao.',
      });
    }

    return this.usersService.updateCurrentUser(user.id, dto);
  }
}
