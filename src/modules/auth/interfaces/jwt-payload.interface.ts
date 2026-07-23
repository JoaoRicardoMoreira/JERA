import { Role } from '../entities/role.enum';

export interface JwtPayload {
  sub: string;
  email: string;
  roles: Role[];
  permissions: string[];
}
