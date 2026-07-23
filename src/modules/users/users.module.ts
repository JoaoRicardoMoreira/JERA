import { Module } from '@nestjs/common';

import { PrismaModule } from '../../database/prisma.module';
import { USERS_REPOSITORY } from './interfaces/user-repository.interface';
import { USERS_SERVICE } from './interfaces/user-service.interface';
import { UserValidator } from './validators/user.validator';
import { UsersController } from './users.controller';
import { UsersRepository } from './users.repository';
import { UsersService } from './users.service';

@Module({
  imports: [PrismaModule],
  controllers: [UsersController],
  providers: [
    UserValidator,
    {
      provide: USERS_REPOSITORY,
      useClass: UsersRepository,
    },
    {
      provide: USERS_SERVICE,
      useClass: UsersService,
    },
    UsersService,
  ],
  exports: [USERS_SERVICE, UsersService],
})
export class UsersModule {}
