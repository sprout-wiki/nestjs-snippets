import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateDemoDto } from './dto/create-demo.dto';
import { UpdateDemoDto } from './dto/update-demo.dto';
import { Demo } from './entities/demo.entity';

@Injectable()
export class DemoService {
  constructor(
    @InjectRepository(Demo)
    private readonly demoRepository: Repository<Demo>,
  ) {}

  async create(createDemoDto: CreateDemoDto) {
    const entity = this.demoRepository.create(createDemoDto);
    console.log(`demo.service> create: ${JSON.stringify(entity)}`);
    return await this.demoRepository.save(entity);
  }

  async findAll() {
    return await this.demoRepository.find();
  }

  async findOne(id: number) {
    return await this.demoRepository.findOneBy({ id });
  }

  async update(id: number, updateDemoDto: UpdateDemoDto) {
    await this.demoRepository.update(id, updateDemoDto);
    return await this.demoRepository.findOneBy({ id });
  }

  async remove(id: number) {
    await this.demoRepository.delete(id);
    return { deleted: true };
  }
}