import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MedicoModule } from './medico/medico.module';
import { PacienteModule } from './paciente/paciente.module';
import { DiagnosticoModule } from './diagnostico/diagnostico.module';
import { MedicoEntity } from './medico/medico.entity/medico.entity';
import { PacienteEntity } from './paciente/paciente.entity/paciente.entity';
import { DiagnosticoEntity } from './diagnostico/diagnostico.entity/diagnostico.entity';
import { PacienteMedicoModule } from './paciente-medico/paciente-medico.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'admin',
      database: 'Parcial2Web',
      entities: [MedicoEntity, PacienteEntity, DiagnosticoEntity],
      dropSchema: true,
      synchronize: true,
      keepConnectionAlive: true
    }),
    MedicoModule,
    PacienteModule,
    DiagnosticoModule,
    PacienteMedicoModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
