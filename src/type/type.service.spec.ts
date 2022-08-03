import { Test, TestingModule } from '@nestjs/testing';
import { TypeService } from './type.service';
import { Type } from './entities/type.entity';
import { getRepositoryToken } from '@nestjs/typeorm';

describe('TypeService', () => {
  let service: TypeService;
  let mockService = {
    find: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TypeService,
        {
          provide: getRepositoryToken(Type),
          useValue: mockService,
        },
      ],
    }).compile();

    service = module.get<TypeService>(TypeService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('Validamos findAll', async () => {
    const spyFind = jest.spyOn(mockService, 'find');
    await service.findAll();
    expect(spyFind).toBeCalled();
  });
});
