import { Module } from '@nestjs/common';
import { DiagnosticoService } from './diagnostico.service';
import { DiagnosticoController } from './diagnostico.controller';
import { DiagnosticoEntity } from './diagnostico.entity/diagnostico.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  providers: [DiagnosticoService],
  controllers: [DiagnosticoController],
  imports: [TypeOrmModule.forFeature([DiagnosticoEntity])],
})
export class DiagnosticoModule {}
