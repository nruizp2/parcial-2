import { Controller, Param, Post, UseInterceptors } from '@nestjs/common';
import { PacienteMedicoService } from './paciente-medico.service';
import { BusinessErrorsInterceptor } from 'src/shared/interceptors/business-errors/business-errors.interceptor';

@Controller('paciente')
@UseInterceptors(BusinessErrorsInterceptor)
export class PacienteMedicoController {
  constructor(private readonly pacienteMedicoService: PacienteMedicoService) {}

  @Post(':pacienteId/medicos/:medicoId')
  async associateDisciplineToPaciente(
    @Param('pacienteId') pacienteId: string,
    @Param('medicoId') medicoId: string
  ): Promise<void> {
    return this.pacienteMedicoService.addMedicoToPaciente(pacienteId, medicoId);
  }


}
