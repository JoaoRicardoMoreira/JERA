import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';

import { PrismaModule } from '../../database/prisma.module';
import { AuthController } from './auth.controller';
import { PrismaAuthRepository } from './auth.repository';
import { AuthService } from './auth.service';
import { AUTH_REPOSITORY } from './interfaces/auth-repository.interface';
import { AuthValidator } from './validators/auth.validator';

@Module({
  imports: [PrismaModule, JwtModule.register({})],
  controllers: [AuthController],
  providers: [
    AuthService,
    AuthValidator,
    {
      provide: AUTH_REPOSITORY,
      useClass: PrismaAuthRepository,
    },
  ],
  exports: [AuthService],
})
export class AuthModule {}
