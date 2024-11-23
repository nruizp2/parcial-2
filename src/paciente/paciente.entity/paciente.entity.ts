import { DiagnosticoEntity } from '../../diagnostico/diagnostico.entity/diagnostico.entity';
import { MedicoEntity } from '../../medico/medico.entity/medico.entity';
import { Column, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn} from 'typeorm';
@Entity()
export class PacienteEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    nombre: string;

    @Column()
    genero: string;

    @ManyToMany(() => MedicoEntity, medico => medico.pacientes)
    medicos: MedicoEntity[]

    @ManyToMany(() => DiagnosticoEntity, diagnostico => diagnostico.pacientes)
    diagnosticos: DiagnosticoEntity[]


    
}
