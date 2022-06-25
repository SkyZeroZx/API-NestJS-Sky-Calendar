import { Test, TestingModule } from '@nestjs/testing';
import { TypeService } from './type.service';

describe('TypeService', () => {
  let service: TypeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TypeService],
    }).compile();

    service = module.get<TypeService>(TypeService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
