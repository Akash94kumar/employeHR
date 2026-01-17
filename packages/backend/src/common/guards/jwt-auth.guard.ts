import { Injectable, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator';

/**
 * WHAT: JWT authentication guard that protects routes
 * 
 * WHY: Guards are the NestJS way to protect routes with authentication
 * This guard checks for JWT tokens and allows public routes marked with @Public()
 * 
 * HOW: Extends Passport's AuthGuard and checks for @Public() decorator
 */
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private reflector: Reflector) {
    super();
  }

  // WHY: Override canActivate to check for @Public() decorator before checking JWT
  canActivate(context: ExecutionContext) {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    
    // WHY: If route is marked as public, skip authentication
    if (isPublic) {
      return true;
    }
    
    // WHY: Otherwise, use the default JWT authentication
    return super.canActivate(context);
  }
}

