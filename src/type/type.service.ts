import { Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Type } from './entities/type.entity';

@Injectable()
export class TypeService {
  private readonly logger = new Logger(TypeService.name);
  constructor(
    @InjectRepository(Type)
    private readonly typeRepository: Repository<Type>,
  ) {}

  async findAll(): Promise<Type[]> {
    this.logger.log('Listando Types');
    const listaTypes: Type[] = await this.typeRepository.find();
    if (listaTypes.length === 0) {
      throw new InternalServerErrorException({
        message: 'No se encontraron Types',
      });
    }
    return listaTypes;
  }
}
