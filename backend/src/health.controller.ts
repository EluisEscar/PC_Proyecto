import { Controller, Get } from '@nestjs/common';

/// Endpoint de salud para el health check del ALB (AWS) y CI/CD.
@Controller('health')
export class HealthController {
  @Get()
  check() {
    return { status: 'ok', timestamp: new Date().toISOString() };
  }
}
