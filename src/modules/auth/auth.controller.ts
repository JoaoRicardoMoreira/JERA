import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiTooManyRequestsResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';

import { AuthService } from './auth.service';
import { Public } from '../../common/decorators/public.decorator';
import { AuthResponseDto } from './dto/auth-response.dto';
import { LoginDto } from './dto/login.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { RegisterDto } from './dto/register.dto';

@ApiTags('Auth')
@Public()
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ApiOperation({ summary: 'Registra um novo usuario e inicia sessao.' })
  @ApiCreatedResponse({ type: AuthResponseDto })
  @ApiBadRequestResponse({ description: 'Payload invalido ou fora das regras de validacao.' })
  @ApiConflictResponse({ description: 'Email ja cadastrado.' })
  @ApiTooManyRequestsResponse({ description: 'Limite de tentativas excedido.' })
  @Throttle({ default: { limit: 5, ttl: 60_000 } })
  register(@Body() dto: RegisterDto): Promise<AuthResponseDto> {
    return this.authService.register(dto);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Autentica usuario com email e senha.' })
  @ApiOkResponse({ type: AuthResponseDto })
  @ApiBadRequestResponse({ description: 'Payload invalido ou fora das regras de validacao.' })
  @ApiUnauthorizedResponse({ description: 'Credenciais invalidas.' })
  @ApiTooManyRequestsResponse({ description: 'Limite de tentativas excedido.' })
  @Throttle({ default: { limit: 5, ttl: 60_000 } })
  login(@Body() dto: LoginDto): Promise<AuthResponseDto> {
    return this.authService.login(dto);
  }

  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Rotaciona refresh token e emite novo access token.' })
  @ApiBody({ type: RefreshTokenDto })
  @ApiOkResponse({ type: AuthResponseDto })
  @ApiBadRequestResponse({ description: 'Payload invalido ou fora das regras de validacao.' })
  @ApiUnauthorizedResponse({ description: 'Refresh token invalido ou expirado.' })
  @ApiTooManyRequestsResponse({ description: 'Limite de tentativas excedido.' })
  @Throttle({ default: { limit: 10, ttl: 60_000 } })
  refresh(@Body() dto: RefreshTokenDto): Promise<AuthResponseDto> {
    return this.authService.refresh(dto);
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Revoga o refresh token informado.' })
  @ApiBody({ type: RefreshTokenDto })
  @ApiOkResponse({ description: 'Sessao revogada com sucesso.' })
  @ApiBadRequestResponse({ description: 'Payload invalido ou fora das regras de validacao.' })
  @ApiTooManyRequestsResponse({ description: 'Limite de tentativas excedido.' })
  @Throttle({ default: { limit: 10, ttl: 60_000 } })
  logout(@Body() dto: RefreshTokenDto): Promise<void> {
    return this.authService.logout(dto);
  }
}
