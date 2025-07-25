import { Test, TestingModule } from '@nestjs/testing';
import { DemoService } from './demo.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Demo } from './entities/demo.entity';

describe('DemoService', () => {
  let service: DemoService;

  const mockRepo = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOneBy: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DemoService,
        {
          provide: getRepositoryToken(Demo),
          useValue: mockRepo,
        },
      ],
    }).compile();

    service = module.get<DemoService>(DemoService);
  });

  // smoke test
  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  // db test
  it('should create a new Demo entity using mock repository', async () => {

    // dto without id (p-key)
    const dto = { title: 'Mock Test', description: 'mocking repository' };

    // fakeEntity
    const fakeEntity = { id: 1, title: 'Mock Test', description: 'mocking repository' };
    
    // create(fakeEntity)
    mockRepo.create.mockReturnValue(fakeEntity);

    // save(fakeEntity)
    mockRepo.save.mockResolvedValue(fakeEntity);

    // createTest
    const result = await service.create(dto);

    expect(mockRepo.create).toHaveBeenCalledWith(dto);
    expect(mockRepo.save).toHaveBeenCalledWith(fakeEntity);
    expect(result).toEqual(fakeEntity);
  });
});
