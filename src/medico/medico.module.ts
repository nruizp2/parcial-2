import { Module } from '@nestjs/common';
import { MedicoService } from './medico.service';
import { MedicoController } from './medico.controller';
import { MedicoEntity } from './medico.entity/medico.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  providers: [MedicoService],
  controllers: [MedicoController],
  imports: [TypeOrmModule.forFeature([MedicoEntity])],
})
export class MedicoModule {}
