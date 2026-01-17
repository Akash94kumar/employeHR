import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';

/**
 * WHAT: Unit test for AppController
 * 
 * WHY: Unit tests verify individual components work correctly
 * This is a basic example that can be expanded
 * 
 * HOW: Uses NestJS testing utilities to create a test module
 */
describe('AppController', () => {
  let controller: AppController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
    }).compile();

    controller = module.get<AppController>(AppController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should return health status', () => {
    const result = controller.getHealth();
    expect(result).toHaveProperty('status', 'ok');
    expect(result).toHaveProperty('timestamp');
  });
});

