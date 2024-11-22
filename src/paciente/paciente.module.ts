import { Module } from '@nestjs/common';
import { PacienteService } from './paciente.service';
import { PacienteController } from './paciente.controller';
import { PacienteEntity } from './paciente.entity/paciente.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  providers: [PacienteService],
  controllers: [PacienteController],
  imports: [TypeOrmModule.forFeature([PacienteEntity])],
})
export class PacienteModule {}
