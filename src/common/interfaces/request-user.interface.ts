import { Id } from '../../shared/types/id.type';

export interface RequestUser {
  id: Id;
  email: string;
  roles: string[];
  permissions: string[];
}
