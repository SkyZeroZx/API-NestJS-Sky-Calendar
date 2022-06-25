import { Test, TestingModule } from '@nestjs/testing';
import { TaskToUserService } from './task_to_user.service';

describe('TaskToUserService', () => {
  let service: TaskToUserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TaskToUserService],
    }).compile();

    service = module.get<TaskToUserService>(TaskToUserService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
