import { Test, TestingModule } from '@nestjs/testing';
import { NotificacionService } from './notificacion.service';

describe('NotificacionService', () => {
  let service: NotificacionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [NotificacionService],
    }).compile();

    service = module.get<NotificacionService>(NotificacionService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
