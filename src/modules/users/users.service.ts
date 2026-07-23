import { Inject, Injectable } from '@nestjs/common';

import { UserResponseDto } from './dto/user-response.dto';
import { UserEntity } from './entities/user.entity';
import { USERS_REPOSITORY, UserRepository } from './interfaces/user-repository.interface';
import { UserService } from './interfaces/user-service.interface';
import { UserMapper } from './mapper/user.mapper';
import { UserValidator } from './validators/user.validator';

@Injectable()
export class UsersService implements UserService {
  constructor(
    @Inject(USERS_REPOSITORY)
    private readonly usersRepository: UserRepository,
    private readonly userValidator: UserValidator,
  ) {}

  async findById(id: string): Promise<UserEntity> {
    const user = await this.usersRepository.findById(id);

    return this.userValidator.ensureExists(user);
  }

  async findByEmail(email: string): Promise<UserEntity> {
    const user = await this.usersRepository.findByEmail(email);

    return this.userValidator.ensureExists(user);
  }

  async getCurrentUser(userId: string): Promise<UserResponseDto> {
    const user = await this.findById(userId);

    return UserMapper.toResponse(user);
  }
}
