import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TaskToUser } from './entities/task_to_user.entity';
import { TaskToUserService } from './task_to_user.service';

describe('TaskToUserService', () => {
  let service: TaskToUserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TaskToUserService,
        {
          provide: getRepositoryToken(TaskToUser),
          useClass: Repository,
        },
      ],
    }).compile();

    service = module.get<TaskToUserService>(TaskToUserService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
