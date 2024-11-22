import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PacienteEntity } from '../paciente/paciente.entity/paciente.entity';
import { MedicoEntity } from '../medico/medico.entity/medico.entity';
import { Repository } from 'typeorm';
import { BusinessLogicException, BusinessError } from '../shared/errors/business-errors';


@Injectable()
export class PacienteMedicoService {

    constructor(
        @InjectRepository(PacienteEntity)
        private readonly pacienteRepository: Repository<PacienteEntity>,
        @InjectRepository(MedicoEntity)
        private readonly medicoRepository: Repository<MedicoEntity>
    ){}

    async addMedicoToPaciente(pacienteId: string, medicoId: string){
        const paciente: PacienteEntity =  await this.pacienteRepository.findOne({where:{id: pacienteId}, relations: ["medicos", "diagnosticos"] });
        if (!paciente)
            throw new BusinessLogicException("The paciente with the given id was not found", BusinessError.NOT_FOUND);

        const medico: MedicoEntity =  await this.medicoRepository.findOne({where:{id: medicoId}, relations: ["pacientes"] });
        if (!medico)
            throw new BusinessLogicException("The medico with the given id was not found", BusinessError.NOT_FOUND);
        if(paciente.medicos.length >= 5){
            throw new BusinessLogicException("El paciente ya tiene 5 medicos", BusinessError.PRECONDITION_FAILED);
        }
        medico.pacientes.push(paciente);
        paciente.medicos.push(medico);

        await this.pacienteRepository.save(paciente);
        await this.medicoRepository.save(medico);
    }



}
