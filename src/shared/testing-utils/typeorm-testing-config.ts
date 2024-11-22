/* eslint-disable prettier/prettier */
/* archivo ../../shared/testing-utils/typeorm-testing-config.ts*/
import { TypeOrmModule } from '@nestjs/typeorm';
import { MedicoEntity } from '../../medico/medico.entity/medico.entity';
import { DiagnosticoEntity } from '../../diagnostico/diagnostico.entity/diagnostico.entity';
import { PacienteEntity } from '../../paciente/paciente.entity/paciente.entity';


export const TypeOrmTestingConfig = () => [
 TypeOrmModule.forRoot({
   type: 'sqlite',
   database: ':memory:',
   dropSchema: true,
   entities: [MedicoEntity, DiagnosticoEntity, PacienteEntity],
   synchronize: true,
   keepConnectionAlive: true
 }),
 TypeOrmModule.forFeature([MedicoEntity, DiagnosticoEntity, PacienteEntity]),
];
/* archivo ../../shared/testing-utils/typeorm-testing-config.ts*/