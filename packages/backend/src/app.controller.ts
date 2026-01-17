import { Controller, Get } from '@nestjs/common';

/**
 * WHAT: Root controller for health checks and basic API information
 * 
 * WHY: Health check endpoints are essential for:
 * - Monitoring and alerting systems
 * - Load balancer health checks
 * - Deployment verification
 * 
 * HOW: Simple GET endpoint that returns application status
 */
@Controller()
export class AppController {
  @Get('health')
  getHealth() {
    // WHY: Simple health check - can be expanded to check database, external services, etc.
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
    };
  }
}

