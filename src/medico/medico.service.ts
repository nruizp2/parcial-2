import { Injectable } from '@nestjs/common';
import { MedicoEntity } from './medico.entity/medico.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BusinessLogicException, BusinessError } from '../shared/errors/business-errors';

@Injectable()
export class MedicoService {
    constructor(
        @InjectRepository(MedicoEntity)
        private readonly medicoRepository: Repository<MedicoEntity>
    ){}


    async findAll(): Promise<MedicoEntity[]> {
        return await this.medicoRepository.find({ relations: ["pacientes"] });
    }
 
    async findOne(id: string): Promise<MedicoEntity> {
        const medico: MedicoEntity = await this.medicoRepository.findOne({where: {id}, relations: ["pacientes"] } );
        if (!medico)
          throw new BusinessLogicException("The medico with the given id was not found", BusinessError.NOT_FOUND);
   
        return medico;
    }
   
    async create(medico: MedicoEntity): Promise<MedicoEntity> {
        if(medico.nombre.length == 0  || medico.especialidad.length == 0){
            throw new BusinessLogicException("Nombre o especialidad vacíos", BusinessError.PRECONDITION_FAILED);
        }
        return await this.medicoRepository.save(medico);
    }
 
    async delete(id: string) {
        const medico: MedicoEntity = await this.medicoRepository.findOne({where:{id}, relations: ["pacientes"] });
        if (!medico)
          throw new BusinessLogicException("The medico with the given id was not found", BusinessError.NOT_FOUND);
        if(medico.pacientes.length > 0){
            throw new BusinessLogicException("No se puede eliminar un medico con pacientes asociados", BusinessError.PRECONDITION_FAILED);
        }
        await this.medicoRepository.remove(medico);
    }
}
