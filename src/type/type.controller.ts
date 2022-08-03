import { Controller, Get, Logger } from '@nestjs/common';
import { TypeService } from './type.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Type Task')
@Controller('type')
export class TypeController {
  private readonly logger = new Logger(TypeController.name);
  constructor(private readonly typeService: TypeService) {}

  @Get()
  findAll() {
    this.logger.log('Listando Types');
    return this.typeService.findAll();
  }
}
