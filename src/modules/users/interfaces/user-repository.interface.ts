import { Gender } from '@prisma/client';

import { UserEntity } from '../entities/user.entity';

export const USERS_REPOSITORY = Symbol('USERS_REPOSITORY');

export interface UpdateUserProfileData {
  name?: string;
  birthDate?: Date | null;
  gender?: Gender | null;
  phone?: string | null;
  occupation?: string | null;
  city?: string | null;
  state?: string | null;
  bio?: string | null;
}

export interface UserRepository {
  findById(id: string): Promise<UserEntity | null>;
  findByEmail(email: string): Promise<UserEntity | null>;
  updateProfile(id: string, data: UpdateUserProfileData): Promise<UserEntity>;
}
