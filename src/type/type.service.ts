import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateTypeDto } from './dto/create-type.dto';
import { UpdateTypeDto } from './dto/update-type.dto';
import { Type } from './entities/type.entity';

@Injectable()
export class TypeService {
  private readonly logger = new Logger(TypeService.name);
  constructor(
    @InjectRepository(Type)
    private readonly typeRepository: Repository<Type>,
  ) {}

  create(createTypeDto: CreateTypeDto) {
    return 'This action adds a new type';
  }

  async findAll() {
    this.logger.log("Listando Types");
    return  this.typeRepository.find();
  }

  findOne(id: number) {
    return `This action returns a #${id} type`;
  }

  update(id: number, updateTypeDto: UpdateTypeDto) {
    return `This action updates a #${id} type`;
  }

  remove(id: number) {
    return `This action removes a #${id} type`;
  }
}
