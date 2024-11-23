import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, UseInterceptors } from '@nestjs/common';
import { PacienteService } from './paciente.service';
import { BusinessErrorsInterceptor } from 'src/shared/interceptors/business-errors/business-errors.interceptor';
import { plainToInstance } from 'class-transformer';
import { PacienteDto } from './paciente.dto/paciente.dto';
import { PacienteEntity } from './paciente.entity/paciente.entity';

@UseInterceptors(BusinessErrorsInterceptor)
@Controller('paciente')
export class PacienteController {
    constructor(private readonly pacienteService: PacienteService) {}

    @Get()
  async findAll() {
    return await this.pacienteService.findAll();
  }

  @Get(':pacienteId')
  async findOne(@Param('pacienteId') pacienteId: string) {
    return await this.pacienteService.findOne(pacienteId);
  }

  @Post()
  async create(@Body() pacienteDto: PacienteDto) {
    const paciente: PacienteEntity = plainToInstance(PacienteEntity, pacienteDto);
    return await this.pacienteService.create(paciente);
  }

  @Delete(':pacienteId')
  @HttpCode(204)
  async delete(@Param('pacienteId') pacienteId: string) {
    return await this.pacienteService.delete(pacienteId);
  }
}
