import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, UseInterceptors } from '@nestjs/common';
import { MedicoService } from './medico.service';
import { BusinessErrorsInterceptor } from 'src/shared/interceptors/business-errors/business-errors.interceptor';
import { plainToInstance } from 'class-transformer';
import { MedicoDto } from './medico.dto/medico.dto';
import { MedicoEntity } from './medico.entity/medico.entity';

@UseInterceptors(BusinessErrorsInterceptor)
@Controller('medico')
export class MedicoController {
    constructor(private readonly medicoService: MedicoService) {}

    @Get()
  async findAll() {
    return await this.medicoService.findAll();
  }

  @Get(':medicoId')
  async findOne(@Param('medicoId') medicoId: string) {
    return await this.medicoService.findOne(medicoId);
  }

  @Post()
  async create(@Body() medicoDto: MedicoDto) {
    const medico: MedicoEntity = plainToInstance(MedicoEntity, medicoDto);
    return await this.medicoService.create(medico);
  }

  @Delete(':medicoId')
  @HttpCode(204)
  async delete(@Param('medicoId') medicoId: string) {
    return await this.medicoService.delete(medicoId);
  }
}
