import { Controller, Get, Logger, UseGuards } from '@nestjs/common';
import { TypeService } from './type.service';
import { ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Type Task')
@Controller('type')
export class TypeController {
  private readonly logger = new Logger(TypeController.name);
  constructor(private readonly typeService: TypeService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  async findAll() {
    this.logger.log('Listando Types');
    return this.typeService.findAll();
  }

}
