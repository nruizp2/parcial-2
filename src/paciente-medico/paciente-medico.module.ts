import { Module } from '@nestjs/common';
import { PacienteMedicoService } from './paciente-medico.service';
import { PacienteMedicoController } from './paciente-medico.controller';
import { PacienteEntity } from '../paciente/paciente.entity/paciente.entity';
import { MedicoEntity } from '../medico/medico.entity/medico.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  providers: [PacienteMedicoService],
  controllers: [PacienteMedicoController],
  imports: [TypeOrmModule.forFeature([PacienteEntity]),TypeOrmModule.forFeature([MedicoEntity]) ],
})
export class PacienteMedicoModule {}
