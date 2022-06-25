import { Test, TestingModule } from '@nestjs/testing';
import { NotificacionController } from './notificacion.controller';
import { NotificacionService } from './notificacion.service';

describe('NotificacionController', () => {
  let controller: NotificacionController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [NotificacionController],
      providers: [NotificacionService],
    }).compile();

    controller = module.get<NotificacionController>(NotificacionController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
