import { BadRequestException, Inject, Injectable } from '@nestjs/common';

import { UserResponseDto } from './dto/user-response.dto';
import { UpdateUserProfileDto } from './dto/update-user-profile.dto';
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

  async updateCurrentUser(userId: string, dto: UpdateUserProfileDto): Promise<UserResponseDto> {
    await this.findById(userId);

    const birthDate =
      dto.birthDate === undefined
        ? undefined
        : dto.birthDate
          ? new Date(`${dto.birthDate}T00:00:00.000Z`)
          : null;

    if (birthDate && birthDate > new Date()) {
      throw new BadRequestException({
        code: 'INVALID_BIRTH_DATE',
        message: 'A data de nascimento nao pode estar no futuro.',
      });
    }

    const optionalText = (value: string | null | undefined) =>
      value === undefined ? undefined : value?.trim() || null;

    const updated = await this.usersRepository.updateProfile(userId, {
      name: dto.name?.trim(),
      birthDate,
      gender: dto.gender,
      phone: optionalText(dto.phone),
      occupation: optionalText(dto.occupation),
      city: optionalText(dto.city),
      state: optionalText(dto.state),
      bio: optionalText(dto.bio),
    });

    return UserMapper.toResponse(updated);
  }
}
