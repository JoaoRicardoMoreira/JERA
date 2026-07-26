import { UserResponseDto } from '../dto/user-response.dto';
import { UpdateUserProfileDto } from '../dto/update-user-profile.dto';
import { UserEntity } from '../entities/user.entity';

export const USERS_SERVICE = Symbol('USERS_SERVICE');

export interface UserService {
  findById(id: string): Promise<UserEntity>;
  findByEmail(email: string): Promise<UserEntity>;
  getCurrentUser(userId: string): Promise<UserResponseDto>;
  updateCurrentUser(userId: string, dto: UpdateUserProfileDto): Promise<UserResponseDto>;
}
