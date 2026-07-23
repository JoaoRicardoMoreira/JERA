import { ForbiddenException } from '@nestjs/common';
import { ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

import { Role } from '../../../modules/auth/entities/role.enum';
import { RolesGuard } from '../roles.guard';

const createContext = (roles: string[] = []): ExecutionContext =>
  ({
    getHandler: jest.fn(),
    getClass: jest.fn(),
    switchToHttp: jest.fn(() => ({
      getRequest: jest.fn(() => ({
        user: {
          id: '6d7f1e72-6b30-49d2-bbb0-5e2dbf0e5b67',
          email: 'user@example.com',
          roles,
          permissions: [],
        },
      })),
    })),
  }) as unknown as ExecutionContext;

describe('RolesGuard', () => {
  let reflector: { getAllAndOverride: jest.Mock };
  let guard: RolesGuard;

  beforeEach(() => {
    reflector = {
      getAllAndOverride: jest.fn(),
    };
    guard = new RolesGuard(reflector as unknown as Reflector);
  });

  it('should allow public routes', () => {
    reflector.getAllAndOverride.mockReturnValueOnce(true);

    expect(guard.canActivate(createContext())).toBe(true);
  });

  it('should allow routes without required roles', () => {
    reflector.getAllAndOverride.mockReturnValueOnce(false).mockReturnValueOnce(undefined);

    expect(guard.canActivate(createContext())).toBe(true);
  });

  it('should allow when user has one required role', () => {
    reflector.getAllAndOverride.mockReturnValueOnce(false).mockReturnValueOnce([Role.ADMIN]);

    expect(guard.canActivate(createContext([Role.USER, Role.ADMIN]))).toBe(true);
  });

  it('should reject when user does not have required role', () => {
    reflector.getAllAndOverride.mockReturnValueOnce(false).mockReturnValueOnce([Role.ADMIN]);

    expect(() => guard.canActivate(createContext([Role.USER]))).toThrow(ForbiddenException);
  });
});
