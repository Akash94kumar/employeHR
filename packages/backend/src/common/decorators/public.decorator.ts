import { SetMetadata } from '@nestjs/common';

/**
 * WHAT: Custom decorator to mark routes as public (skip authentication)
 * 
 * WHY: Some routes (like login, health check) should be accessible without authentication
 * This decorator works with JwtAuthGuard to bypass authentication checks
 * 
 * HOW: Uses SetMetadata to attach metadata that guards can read
 */
export const IS_PUBLIC_KEY = 'isPublic';
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);

