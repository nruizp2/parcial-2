import { Injectable } from '@nestjs/common';
import { PacienteEntity } from './paciente.entity/paciente.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BusinessLogicException, BusinessError } from '../shared/errors/business-errors';

@Injectable()
export class PacienteService {
    constructor(
        @InjectRepository(PacienteEntity)
        private readonly pacienteRepository: Repository<PacienteEntity>
    ){}


    async findAll(): Promise<PacienteEntity[]> {
        return await this.pacienteRepository.find({ relations: ["medicos", "diagnosticos"] });
    }
 
    async findOne(id: string): Promise<PacienteEntity> {
        const paciente: PacienteEntity = await this.pacienteRepository.findOne({where: {id}, relations: ["medicos", "diagnosticos"] } );
        if (!paciente)
          throw new BusinessLogicException("The paciente with the given id was not found", BusinessError.NOT_FOUND);
   
        return paciente;
    }
   
    async create(paciente: PacienteEntity): Promise<PacienteEntity> {
        if(paciente.nombre.length < 3){
            throw new BusinessLogicException("Nombre menor de 3 caracteres", BusinessError.PRECONDITION_FAILED);
        }
        return await this.pacienteRepository.save(paciente);
    }
 
    async delete(id: string) {
        const paciente: PacienteEntity = await this.pacienteRepository.findOne({where:{id}, relations: ["medicos", "diagnosticos"] });
        if (!paciente)
          throw new BusinessLogicException("The paciente with the given id was not found", BusinessError.NOT_FOUND);
        if(paciente.diagnosticos.length > 0){
            throw new BusinessLogicException("No se puede eliminar un paciente con diagnosticos asociados", BusinessError.PRECONDITION_FAILED);
        }
        await this.pacienteRepository.remove(paciente);
    }
}
