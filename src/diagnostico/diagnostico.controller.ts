import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, UseInterceptors } from '@nestjs/common';
import { DiagnosticoService } from './diagnostico.service';
import { BusinessErrorsInterceptor } from 'src/shared/interceptors/business-errors/business-errors.interceptor';
import { plainToInstance } from 'class-transformer';
import { DiagnosticoDto } from './diagnostico.dto/diagnostico.dto';
import { DiagnosticoEntity } from './diagnostico.entity/diagnostico.entity';

@UseInterceptors(BusinessErrorsInterceptor)
@Controller('diagnostico')
export class DiagnosticoController {
    constructor(private readonly diagnosticoService: DiagnosticoService) {}

    @Get()
  async findAll() {
    return await this.diagnosticoService.findAll();
  }

  @Get(':diagnosticoId')
  async findOne(@Param('diagnosticoId') diagnosticoId: string) {
    return await this.diagnosticoService.findOne(diagnosticoId);
  }

  @Post()
  async create(@Body() diagnosticoDto: DiagnosticoDto) {
    const diagnostico: DiagnosticoEntity = plainToInstance(DiagnosticoEntity, diagnosticoDto);
    return await this.diagnosticoService.create(diagnostico);
  }

  @Delete(':diagnosticoId')
  @HttpCode(204)
  async delete(@Param('diagnosticoId') diagnosticoId: string) {
    return await this.diagnosticoService.delete(diagnosticoId);
  }
}
