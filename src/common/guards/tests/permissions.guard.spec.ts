import { ForbiddenException } from '@nestjs/common';
import { ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

import { Permission } from '../../../modules/auth/entities/permission.enum';
import { PermissionsGuard } from '../permissions.guard';

const createContext = (permissions: string[] = []): ExecutionContext =>
  ({
    getHandler: jest.fn(),
    getClass: jest.fn(),
    switchToHttp: jest.fn(() => ({
      getRequest: jest.fn(() => ({
        user: {
          id: '6d7f1e72-6b30-49d2-bbb0-5e2dbf0e5b67',
          email: 'user@example.com',
          roles: [],
          permissions,
        },
      })),
    })),
  }) as unknown as ExecutionContext;

describe('PermissionsGuard', () => {
  let reflector: { getAllAndOverride: jest.Mock };
  let guard: PermissionsGuard;

  beforeEach(() => {
    reflector = {
      getAllAndOverride: jest.fn(),
    };
    guard = new PermissionsGuard(reflector as unknown as Reflector);
  });

  it('should allow public routes', () => {
    reflector.getAllAndOverride.mockReturnValueOnce(true);

    expect(guard.canActivate(createContext())).toBe(true);
  });

  it('should allow routes without required permissions', () => {
    reflector.getAllAndOverride.mockReturnValueOnce(false).mockReturnValueOnce(undefined);

    expect(guard.canActivate(createContext())).toBe(true);
  });

  it('should allow when user has all required permissions', () => {
    reflector.getAllAndOverride
      .mockReturnValueOnce(false)
      .mockReturnValueOnce([Permission.TRANSACTIONS_READ, Permission.DASHBOARD_READ]);

    expect(
      guard.canActivate(createContext([Permission.TRANSACTIONS_READ, Permission.DASHBOARD_READ])),
    ).toBe(true);
  });

  it('should reject when user is missing any required permission', () => {
    reflector.getAllAndOverride
      .mockReturnValueOnce(false)
      .mockReturnValueOnce([Permission.TRANSACTIONS_READ, Permission.TRANSACTIONS_CREATE]);

    expect(() => guard.canActivate(createContext([Permission.TRANSACTIONS_READ]))).toThrow(
      ForbiddenException,
    );
  });
});
