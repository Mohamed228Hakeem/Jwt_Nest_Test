// src/auth/roles.guard.ts
import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    // Get the required roles from the @Roles() decorator
    const requiredRoles = this.reflector.get<string[]>('roles', context.getHandler());
    if (!requiredRoles) return true; // No roles specified → allow access

    const { user } = context.switchToHttp().getRequest();
    if (!user) throw new ForbiddenException('User not found in request');

    // Check if the user's role matches any of the required roles
    const hasRole = requiredRoles.includes(user.role);
    if (!hasRole)
      throw new ForbiddenException(`Access denied for role: ${user.role}`);

    return true;
  }
}
