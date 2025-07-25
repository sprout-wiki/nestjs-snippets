import { Test, TestingModule } from '@nestjs/testing';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule, getDataSourceToken } from '@nestjs/typeorm';
import { Demo } from './entities/demo.entity';
import { DemoService } from './demo.service';
import { DataSource } from 'typeorm';

describe('DemoService (Integration)', () => {
  let service: DemoService;
  let dataSource: DataSource;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({ isGlobal: true }),
        TypeOrmModule.forRootAsync({
          imports: [ConfigModule],
          inject: [ConfigService],
          useFactory: (config: ConfigService) => ({
            type: 'mariadb',
            host: config.get('DB_HOST'),
            port: +config.get<number>('DB_PORT'),
            username: config.get('DB_USER'),
            password: config.get('DB_PASS'),
            database: config.get('DB_NAME'),
            entities: [Demo],
            synchronize: true,
          }),
        }),
        TypeOrmModule.forFeature([Demo]),
      ],
      providers: [DemoService],
    }).compile();

    service = module.get<DemoService>(DemoService);
    dataSource = module.get<DataSource>(getDataSourceToken());
  });

  it('should create and read a Demo entity from DB', async () => {
    const created = await service.create({ title: 'Integration Test', description: 'testing write' });
    expect(created.id).toBeDefined();
    expect(created.title).toBe('Integration Test');

    const all = await service.findAll();
    const found = all.find((item) => item.id === created.id);
    expect(found).toBeDefined();
    expect(found?.title).toBe('Integration Test');
  });

  afterAll(async () => {
    if (dataSource && dataSource.isInitialized) {
      await dataSource.destroy();
    }
  });
});
