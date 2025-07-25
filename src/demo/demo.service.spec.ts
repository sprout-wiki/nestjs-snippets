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
    console.log('🔹 [TEST] should be defined');
    expect(service).toBeDefined();
  });

  // db test
  it('should create a new Demo entity using mock repository', async () => {
    console.log('🔹 [TEST] should create a new Demo entity using mock repository');

    // dto without id (p-key)
    const dto = { title: 'Mock Test', description: 'mocking repository' };

    // fakeEntity
    const fakeEntity = { id: 1, title: 'Mock Test', description: 'mocking repository' };
    
    // mock create
    mockRepo.create.mockImplementation((arg) => {
      console.log('✅ mockRepo.create called with:', arg);
      return fakeEntity;
    });
    
    // mock save
    mockRepo.save.mockImplementation(async (arg) => {
      console.log('✅ mockRepo.save called with:', arg);
      return fakeEntity;
    });

    // createTest
    const result = await service.create(dto);

    // optional expectations for clarity
    expect(result).toEqual(fakeEntity);
    expect(mockRepo.create).toHaveBeenCalledWith(dto);
    expect(mockRepo.save).toHaveBeenCalledWith(fakeEntity);
  });
});
